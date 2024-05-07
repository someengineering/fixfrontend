import * as assert from 'assert'
import { parse_expr } from './lexer.ts'
import {
  AggregateP,
  BoolOperationP,
  JsonElementP,
  LimitP,
  MergeQueryP,
  NavigationP,
  parse_path,
  PartP,
  PathP,
  QueryP,
  SimpleTermP,
  SortP,
  TermP,
  WithClauseP,
  WithUsageP,
} from './parser.ts'
import {
  AllTerm,
  CombinedTerm,
  ContextTerm,
  Direction,
  EdgeType,
  FulltextTerm,
  IdTerm,
  IsTerm,
  Limit,
  MergeQuery,
  MergeTerm,
  Navigation,
  Part,
  Path,
  PathPart,
  Predicate,
  Query,
  Sort,
  SortOrder,
  WithClause,
  WithClauseFilter,
  WithUsage,
} from './query.ts'

const parse_variable = parse_expr(PathP)
const parse_bool_operation = parse_expr(BoolOperationP)
const parse_json = parse_expr(JsonElementP)
const parse_simple_term = parse_expr(SimpleTermP)
const parse_sort = parse_expr(SortP)
const parse_limit = parse_expr(LimitP)
const parse_navigation = parse_expr(NavigationP)
const parse_part = parse_expr(PartP)
const parse_term = parse_expr(TermP)
const parse_query = parse_expr(QueryP)
const parse_merge_query = parse_expr(MergeQueryP)
const parse_with_clause = parse_expr(WithClauseP)
const parse_aggregate = parse_expr(AggregateP)
const parse_with_usage = parse_expr(WithUsageP)

const foo = Path.from('foo')
const bar = Path.from('bar')
const foo_bar = Path.from_string('foo.bar')
const bla = Path.from('bla')

test(`Parse Json`, () => {
  assert.strictEqual(parse_json('1'), 1)
  const rich_string = '!dfg%23  {foo} [bla] \\" fdjghdfhg \' '
  assert.strictEqual(parse_json('"' + rich_string + '"'), rich_string)
  assert.strictEqual(parse_json('test'), 'test')
  assert.strictEqual(parse_json('  "test" '), 'test')
  assert.deepEqual(parse_json('[]'), [])
  assert.deepEqual(parse_json('[1]'), [1])
  assert.deepEqual(parse_json('[1,2,3,4]'), [1, 2, 3, 4])
  assert.deepEqual(parse_json('{}'), {})
  assert.deepEqual(parse_json('{foo:[23]}'), { foo: [23] })
  assert.deepEqual(parse_json('{foo:  [23], bla:   "test"}'), { foo: [23], bla: 'test' })
})

test(`Parse Bool Operation`, () => {
  assert.strictEqual(parse_bool_operation('and'), 'and')
  assert.strictEqual(parse_bool_operation('or'), 'or')
})

test(`Parse Path`, () => {
  assert.deepEqual(parse_path('foo'), Path.from('foo'))
  assert.deepEqual(parse_path('/foo'), Path.from('foo', true))
  assert.deepEqual(parse_path('/foo[*].bla[*].bar').toString(), '/foo[*].bla[*].bar')
  assert.deepEqual(parse_path('/foo[1].bla[2].bar').toString(), '/foo[1].bla[2].bar')
  assert.deepEqual(parse_path('/foo[0].bla[0].bar').toString(), '/foo[0].bla[0].bar')
})

test(`Parse Variable`, () => {
  assert.deepEqual(parse_variable('foo'), foo)
  assert.deepEqual(parse_variable('/foo'), Path.from('foo', true))
  assert.deepEqual(parse_variable('foo.bla.bar'), Path.from(['foo', 'bla', 'bar']))
  assert.deepEqual(parse_variable('/foo.bla.bar'), Path.from(['foo', 'bla', 'bar'], true))
  assert.deepEqual(
    parse_variable('/foo[*].bla[].bar[*]'),
    new Path({ parts: ['foo', 'bla', 'bar'].map((name) => new PathPart({ name, array_access: '*' })), root: true }),
  )
  assert.deepEqual(
    parse_variable('`foo . bla . bar / do`[*].`[][]bla#$![]`[2].`bar`'),
    new Path({
      parts: [
        new PathPart({ name: 'foo . bla . bar / do', array_access: '*', backtick: true }),
        new PathPart({ name: '[][]bla#$![]', array_access: 2, backtick: true }),
        new PathPart({ name: 'bar', backtick: true }),
      ],
    }),
  )
})

test(`Parse Simple Term`, () => {
  assert.deepEqual(parse_simple_term('is(instance)'), new IsTerm({ kinds: ['instance'] }))
  assert.deepEqual(parse_simple_term('id(test1234)'), new IdTerm({ ids: ['test1234'] }))
  assert.deepEqual(parse_simple_term('all'), new AllTerm())
  assert.deepEqual(parse_simple_term('foo==23'), new Predicate({ path: foo, op: '==', value: 23 }))
  assert.deepEqual(parse_simple_term('bla!=["1", 2]'), new Predicate({ path: bla, op: '!=', value: ['1', 2] }))
  assert.deepEqual(
    parse_simple_term('foo.bla.bar.{test=23}'),
    new ContextTerm({
      path: Path.from_string('foo.bla.bar'),
      term: new Predicate({ path: Path.from('test'), op: '=', value: 23 }),
    }),
  )
  assert.deepEqual(parse_simple_term('"test"'), new FulltextTerm({ text: 'test' }))
})

test(`Parse Term`, () => {
  // can also parse simple terms
  assert.deepEqual(parse_term('is(a,b,c)'), new IsTerm({ kinds: ['a', 'b', 'c'] }))
  assert.deepEqual(parse_term('is([a,b,c])'), new IsTerm({ kinds: ['a', 'b', 'c'] }))
  assert.deepEqual(parse_term('id(test1234)'), new IdTerm({ ids: ['test1234'] }))
  assert.deepEqual(parse_term('all'), new AllTerm())
  assert.deepEqual(parse_term('foo==23'), new Predicate({ path: foo, op: '==', value: 23 }))
  assert.deepEqual(parse_term('bla!=["1", 2]'), new Predicate({ path: bla, op: '!=', value: ['1', 2] }))
  assert.deepEqual(
    parse_term('foo.bla.bar.{test=23}'),
    new ContextTerm({
      path: Path.from_string('foo.bla.bar'),
      term: new Predicate({ path: Path.from('test'), op: '=', value: 23 }),
    }),
  )
  const ftt = new FulltextTerm({ text: 'test' })
  const ftg = new FulltextTerm({ text: 'goo' })
  assert.deepEqual(parse_term('"test"'), ftt)
  assert.deepEqual(parse_term('"test" or "goo"'), new CombinedTerm({ left: ftt, op: 'or', right: ftg }))
  assert.deepEqual(parse_term('("test" or "goo")'), new CombinedTerm({ left: ftt, op: 'or', right: ftg }))
  assert.deepEqual(parse_term('(("test") or ("goo"))'), new CombinedTerm({ left: ftt, op: 'or', right: ftg }))
  assert.deepEqual(
    parse_term('(foo > 23 and (("test") or ("goo")))'),
    new CombinedTerm({
      left: new Predicate({ path: foo, op: '>', value: 23 }),
      op: 'and',
      right: new CombinedTerm({ left: ftt, op: 'or', right: ftg }),
    }),
  )
})

test(`Parse Sort`, () => {
  assert.deepEqual(parse_sort('sort foo.bar'), [new Sort({ path: foo_bar, order: SortOrder.asc })])
  assert.deepEqual(parse_sort('sort foo.bar asc'), [new Sort({ path: foo_bar, order: SortOrder.asc })])
  assert.deepEqual(parse_sort('sort foo.bar desc'), [new Sort({ path: foo_bar, order: SortOrder.desc })])
  assert.deepEqual(parse_sort('sort foo asc, bar desc, bla'), [
    new Sort({ path: foo, order: SortOrder.asc }),
    new Sort({ path: bar, order: SortOrder.desc }),
    new Sort({ path: bla, order: SortOrder.asc }),
  ])
})

test(`Parse Limit`, () => {
  assert.deepEqual(parse_limit('limit 10'), new Limit({ length: 10 }))
  assert.deepEqual(parse_limit('limit 10,20'), new Limit({ offset: 10, length: 20 }))
})

test(`Parse Navigation`, () => {
  assert.strictEqual(parse_navigation('-->').toString(), '-->')
  assert.strictEqual(parse_navigation('-[2:3]->').toString(), '-[2:3]->')
  assert.strictEqual(parse_navigation('-[2:]->').toString(), '-[2:]->')
  assert.strictEqual(parse_navigation('-[2]->').toString(), '-[2]->')
  assert.deepEqual(parse_navigation('-->'), new Navigation({ start: 1, until: 1 }))
  assert.deepEqual(parse_navigation('-[2]->').toString(), '-[2]->')
  assert.deepEqual(parse_navigation('-[2:]->').toString(), '-[2:]->')
  assert.deepEqual(parse_navigation('-[2:3]->'), new Navigation({ start: 2, until: 3 }))
  assert.deepEqual(
    parse_navigation('-[2:3]delete->'),
    new Navigation({
      start: 2,
      until: 3,
      edge_types: [EdgeType.delete],
    }),
  )
  assert.deepEqual(
    parse_navigation('-delete[2:3]->'),
    new Navigation({
      start: 2,
      until: 3,
      edge_types: [EdgeType.delete],
    }),
  )
  assert.deepEqual(
    parse_navigation('<-delete[2:3]->'),
    new Navigation({
      start: 2,
      until: 3,
      edge_types: [EdgeType.delete],
      direction: Direction.any,
    }),
  )
})

test(`Parse WithClause`, () => {
  const with_filter = new WithClauseFilter({ op: '>', num: 0 })
  const navigation = new Navigation({ until: 1 })
  const term = new IsTerm({ kinds: ['instance'] })
  const with_clause = new WithClause({ with_filter, navigation, term })
  assert.deepEqual(parse_with_clause('with(any, --> is(instance))'), with_clause)
  assert.deepEqual(
    parse_with_clause('with(any, --> is(instance) with(any, --> is(instance)))'),
    new WithClause({
      with_filter,
      navigation,
      term,
      with_clause,
    }),
  )
})

test(`Parse Part`, () => {
  const pred = new Predicate({ path: foo, op: '=', value: 23 })
  const ctx = new ContextTerm({ path: foo_bar, term: new Predicate({ path: foo, op: '>', value: 23 }) })
  const is = new IsTerm({ kinds: ['instance'] })
  const combined = new CombinedTerm({
    left: is,
    op: 'and',
    right: new CombinedTerm({ left: pred, op: 'and', right: ctx }),
  })
  const sort = [new Sort({ path: bla, order: SortOrder.asc })]
  const limit = new Limit({ length: 10 })
  assert.deepEqual(parse_part('foo=23 sort bla limit 10'), new Part({ term: pred, sort, limit }))
  assert.deepEqual(
    parse_part('is(instance) and foo=23 and foo.bar.{foo>23} sort bla limit 10'),
    new Part({
      term: combined,
      sort,
      limit,
    }),
  )
  assert.deepEqual(parse_part('is(instance) -->'), new Part({ term: is, navigation: new Navigation({ until: 1 }) }))
})

test(`Parse Merge Query`, () => {
  const pred = new Predicate({ path: foo, op: '=', value: 23 })
  const part = new Part({ term: pred })
  assert.deepEqual(
    parse_merge_query('foo: <-- foo=23'),
    new MergeQuery({
      path: foo,
      query: new Query({
        parts: [new Part({ term: new AllTerm(), navigation: new Navigation({ until: 1, direction: Direction.inbound }) }), part],
      }),
    }),
  )
})

test(`Parse Query`, () => {
  const pred = new Predicate({ path: foo, op: '=', value: 23 })
  const ctx = new ContextTerm({ path: foo_bar, term: new Predicate({ path: bla, op: '>', value: 23 }) })
  const is = new IsTerm({ kinds: ['instance'] })
  const combined = new CombinedTerm({
    left: is,
    op: 'and',
    right: new CombinedTerm({ left: pred, op: 'and', right: ctx }),
  })
  const sort = [new Sort({ path: bla, order: SortOrder.asc })]
  const limit = new Limit({ length: 10 })
  const part = new Part({ term: pred, sort, limit })
  const with_clause = new WithClause({
    with_filter: new WithClauseFilter({ op: '==', num: 0 }),
    navigation: new Navigation({ until: 1, direction: Direction.inbound }),
    term: pred,
  })
  assert.deepEqual(parse_query('foo=23 sort bla limit 10'), new Query({ parts: [part] }))
  assert.deepEqual(
    parse_query('is(instance) with(empty, <-- foo=23) sort bla limit 10'),
    new Query({ parts: [new Part({ term: is, with_clause, sort, limit })] }),
  )
  assert.deepEqual(
    parse_query('is(instance) and foo=23 and foo.bar.{bla>23} sort bla limit 10 --> foo=23 sort bla limit 10'),
    new Query({ parts: [new Part({ term: combined, sort, limit, navigation: new Navigation({ until: 1 }) }), part] }),
  )
  assert.deepEqual(
    parse_query('is(instance) {foo: --> foo=23, bla: <-- is(instance)}'),
    new Query({
      parts: [
        new Part({
          term: new MergeTerm({
            preFilter: is,
            merge: [
              new MergeQuery({
                path: foo,
                query: new Query({
                  parts: [
                    new Part({ term: new AllTerm(), navigation: new Navigation({ until: 1, direction: Direction.outbound }) }),
                    new Part({ term: pred }),
                  ],
                }),
              }),
              new MergeQuery({
                path: bla,
                query: new Query({
                  parts: [
                    new Part({ term: new AllTerm(), navigation: new Navigation({ until: 1, direction: Direction.inbound }) }),
                    new Part({ term: is }),
                  ],
                }),
              }),
            ],
          }),
        }),
      ],
    }),
  )
})

test('Parse With Usage', () => {
  assert.deepEqual(parse_with_usage('with_usage(1d, foo)'), new WithUsage({ start: '1d', metrics: ['foo'] }))
  assert.deepEqual(parse_with_usage('with_usage(1d, foo, bla, bar)'), new WithUsage({ start: '1d', metrics: ['foo', 'bla', 'bar'] }))
  assert.deepEqual(parse_with_usage('with_usage(1d, [foo, bla, bar])'), new WithUsage({ start: '1d', metrics: ['foo', 'bla', 'bar'] }))
  assert.deepEqual(parse_with_usage('with_usage(1d::2d, foo)'), new WithUsage({ start: '1d', end: '2d', metrics: ['foo'] }))
})

test('Parse Aggregates', () => {
  function assert_aggregate(query: string) {
    assert.strictEqual(parse_aggregate(query).toString(), query)
  }

  function assert_query(query: string, expected: string | undefined = undefined) {
    assert.strictEqual(parse_query(query).toString(), expected || query)
  }

  assert_aggregate('aggregate("kind" as k, bla as foo, bar: sum(1) as count)')
  assert_aggregate('aggregate(sum(1) as count)')
  assert_aggregate('aggregate(a, b, c, d, e: sum(a.b.c.d.e + 23) as count)')
  assert_aggregate('aggregate(a.b.c.d.e as group: max(a.b.c.d.e + 23), min(a.b.c) as mini)')

  // query with aggregate
  assert_query('aggregate(a.b.c as foo, b.c as bla: sum(1) as count): is(instance) and foo = 23')
  assert_query(
    'search is(instance) and foo = 23 | aggregate foo: sum(1) as count',
    'aggregate(foo: sum(1) as count): is(instance) and foo = 23',
  )
})

test('Parse piped queries', () => {
  assert.strictEqual(
    parse_query('search is(instance) and foo = 23 | search is(foo) and bla = 12').toString(),
    'is(instance) and foo = 23 and is(foo) and bla = 12',
  )
  assert.strictEqual(
    parse_query('search is(instance) or foo = 23 | search is(foo) and bla = 12').toString(),
    '(is(instance) or foo = 23) and is(foo) and bla = 12',
  )
})

test('Parse existing queries', () => {
  // Those queries are coming from the benchmark checks. They are not meant to be exhaustive, but to cover a wider range of queries
  const queries = [
    'is(aws_acm_certificate) and type!=IMPORTED and certificate_transparency_logging!=ENABLED',
    'is(aws_apigateway_rest_api) with(empty, --> is(aws_apigateway_authorizer))',
    'is(aws_apigateway_stage) and stage_client_certificate_id==null <-[2]- is(aws_apigateway_rest_api)',
    'is(aws_apigateway_stage) and stage_method_settings!={}',
    'is(aws_apigateway_stage) and stage_web_acl_arn==null',
    'is(aws_autoscaling_group) with (any, --> is(aws_ec2_launch_template) and launch_template_data.network_interfaces[*].associate_public_ip_address==true)',
    'is(aws_cloudfront_distribution) and distribution_config.logging==null',
    'is(aws_cloudfront_distribution) and distribution_config.web_acl_id in [null, ""]',
    'is(aws_region) with(empty, -[0:1]-> is(aws_cloud_trail) and trail_status.is_logging==true)',
    'is(aws_cloud_trail) and trail_status.is_logging==true and trail_log_file_validation_enabled==false',
    'is(aws_cloud_trail) and trail_status.is_logging==true --> is(aws_s3_bucket) and bucket_public_access_block_configuration.{block_public_acls!=true or ignore_public_acls!=true or block_public_policy!=true or restrict_public_buckets!=true} or bucket_acl.grants[*].{permission in [READ, READ_ACP] and grantee.uri=="http://acs.amazonaws.com/groups/global/AllUsers"}',
    'is(aws_cloud_trail) and trail_status.is_logging==false',
    'is(aws_cloud_trail) and trail_status.is_logging==true and trail_status.latest_delivery_attempt_succeeded<42',
    'is(aws_cloud_trail) --> is(aws_s3_bucket) and bucket_logging.target_bucket==null',
    'is(aws_cloud_trail) and trail_kms_key_id==null',
    'is(aws_region) with(empty, --> is(aws_cloud_trail) and trail_has_custom_event_selectors=true and (trail_event_selectors.event_selectors[*].{read_write_type in [All, WriteOnly] and data_resources[*].type="AWS::S3::Object"} or trail_event_selectors.advanced_event_selectors[*].field_selectors[*].{selector_field=="resources.type" and equals[*]="AWS::S3::Object"}))',
    'is(aws_region) with(empty, --> is(aws_cloud_trail) and trail_has_custom_event_selectors=true and (trail_event_selectors.event_selectors[*].{read_write_type in [All, ReadOnly] and data_resources[*].type="AWS::S3::Object"} or trail_event_selectors.advanced_event_selectors[*].field_selectors[*].{selector_field=="resources.type" and equals[*]="AWS::S3::Object"}))',
    'is(aws_region) with(empty, --> is(aws_cloud_trail) and trail_has_custom_event_selectors=true and (trail_event_selectors.event_selectors[*].{data_resources[*].type="AWS::Lambda::Function"} or trail_event_selectors.advanced_event_selectors[*].field_selectors[*].{selector_field=="resources.type" and equals[*]="AWS::Lambda::Function"}))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\$\\.errorCode\\s*=\\s*\\"\\*UnauthorizedOperation\\".+\\$\\.errorCode\\s*=\\s*\\"AccessDenied\\*\\".+\\$\\.sourceIPAddress\\s*!=\\s*\\"delivery.logs.amazonaws.com\\".+\\$\\.eventName\\s*!=\\s*\\"HeadBucket\\""))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\(\\s*\\$\\.eventName\\s*=\\s*\\"ConsoleLogin\\"\\)\\s+&&\\s+\\(\\s*\\$.additionalEventData\\.MFAUsed\\s*!=\\s*\\"Yes\\""))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with (empty, --> is(aws_cloudwatch_log_group) with (any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.userIdentity\\.type\\s*=\\s*\\"Root\\".+\\$\\.userIdentity\\.invokedBy NOT EXISTS.+\\$\\.eventType\\s*!=\\s*\\"AwsServiceEvent\\""))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventName\\s*=\\s*DeleteGroupPolicy.+\\$\\.eventName\\s*=\\s*DeleteRolePolicy.+\\$\\.eventName\\s*=\\s*DeleteUserPolicy.+\\$\\.eventName\\s*=\\s*PutGroupPolicy.+\\$\\.eventName\\s*=\\s*PutRolePolicy.+\\$\\.eventName\\s*=\\s*PutUserPolicy.+\\$\\.eventName\\s*=\\s*CreatePolicy.+\\$\\.eventName\\s*=\\s*DeletePolicy.+\\$\\.eventName\\s*=\\s*CreatePolicyVersion.+\\$\\.eventName\\s*=\\s*DeletePolicyVersion.+\\$\\.eventName\\s*=\\s*AttachRolePolicy.+\\$\\.eventName\\s*=\\s*DetachRolePolicy.+\\$\\.eventName\\s*=\\s*AttachUserPolicy.+\\$\\.eventName\\s*=\\s*DetachUserPolicy.+\\$\\.eventName\\s*=\\s*AttachGroupPolicy.+\\$\\.eventName\\s*=\\s*DetachGroupPolicy\\"))\\s*\\$\\.userIdentity\\.type\\s*=\\s*\\"Root\\".+\\$\\.userIdentity\\.invokedBy NOT EXISTS.+\\$\\.eventType\\s*!=\\s*\\"AwsServiceEvent\\""))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventName\\s*=\\s*CreateTrail.+\\$\\.eventName\\s*=\\s*UpdateTrail.+\\$\\.eventName\\s*=\\s*DeleteTrail.+\\$\\.eventName\\s*=\\s*StartLogging.+\\$\\.eventName\\s*=\\s*StopLogging"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventName\\s*=\\s*ConsoleLogin.+\\$\\.errorMessage\\s*=\\s*\\"Failed authentication\\"))\\s*\\$\\.eventName\\s*=\\s*CreateTrail.+\\$\\.eventName\\s*=\\s*UpdateTrail.+\\$\\.eventName\\s*=\\s*DeleteTrail.+\\$\\.eventName\\s*=\\s*StartLogging.+\\$\\.eventName\\s*=\\s*StopLogging"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventSource\\s*=\\s*kms.amazonaws.com.+\\$\\.eventName\\s*=\\s*DisableKey.+\\$\\.eventName\\s*=\\s*ScheduleKeyDeletion"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventSource\\s*=\\s*s3.amazonaws.com.+\\$\\.eventName\\s*=\\s*PutBucketAcl.+\\$\\.eventName\\s*=\\s*PutBucketPolicy.+\\$\\.eventName\\s*=\\s*PutBucketCors.+\\$\\.eventName\\s*=\\s*PutBucketLifecycle.+\\$\\.eventName\\s*=\\s*PutBucketReplication.+\\$\\.eventName\\s*=\\s*DeleteBucketPolicy.+\\$\\.eventName\\s*=\\s*DeleteBucketCors.+\\$\\.eventName\\s*=\\s*DeleteBucketLifecycle.+\\$\\.eventName\\s*=\\s*DeleteBucketReplication"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventSource\\s*=\\s*config.amazonaws.com.+\\$\\.eventName\\s*=\\s*StopConfigurationRecorder.+\\$\\.eventName\\s*=\\s*DeleteDeliveryChannel.+\\$\\.eventName\\s*=\\s*PutDeliveryChannel.+\\$\\.eventName\\s*=\\s*PutConfigurationRecorder"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventName\\s*=\\s*AuthorizeSecurityGroupIngress.+\\$\\.eventName\\s*=\\s*AuthorizeSecurityGroupEgress.+\\$\\.eventName\\s*=\\s*RevokeSecurityGroupIngress.+\\$\\.eventName\\s*=\\s*RevokeSecurityGroupEgress.+\\$\\.eventName\\s*=\\s*CreateSecurityGroup.+\\$\\.eventName\\s*=\\s*DeleteSecurityGroup"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventName\\s*=\\s*CreateNetworkAcl.+\\$\\.eventName\\s*=\\s*CreateNetworkAclEntry.+\\$\\.eventName\\s*=\\s*DeleteNetworkAcl.+\\$\\.eventName\\s*=\\s*DeleteNetworkAclEntry.+\\$\\.eventName\\s*=\\s*ReplaceNetworkAclEntry.+\\$\\.eventName\\s*=\\s*ReplaceNetworkAclAssociation"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventName\\s*=\\s*CreateCustomerGateway.+\\$\\.eventName\\s*=\\s*DeleteCustomerGateway.+\\$\\.eventName\\s*=\\s*AttachInternetGateway.+\\$\\.eventName\\s*=\\s*CreateInternetGateway.+\\$\\.eventName\\s*=\\s*DeleteInternetGateway.+\\$\\.eventName\\s*=\\s*DetachInternetGateway"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventName\\s*=\\s*CreateRoute.+\\$\\.eventName\\s*=\\s*CreateRouteTable.+\\$\\.eventName\\s*=\\s*ReplaceRoute.+\\$\\.eventName\\s*=\\s*ReplaceRouteTableAssociation.+\\$\\.eventName\\s*=\\s*DeleteRouteTable.+\\$\\.eventName\\s*=\\s*DeleteRoute.+\\$\\.eventName\\s*=\\s*DisassociateRouteTable"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventName\\s*=\\s*CreateVpc.+\\$\\.eventName\\s*=\\s*DeleteVpc.+\\$\\.eventName\\s*=\\s*ModifyVpcAttribute.+\\$\\.eventName\\s*=\\s*AcceptVpcPeeringConnection.+\\$\\.eventName\\s*=\\s*CreateVpcPeeringConnection.+\\$\\.eventName\\s*=\\s*DeleteVpcPeeringConnection.+\\$\\.eventName\\s*=\\s*RejectVpcPeeringConnection.+\\$\\.eventName\\s*=\\s*AttachClassicLinkVpc.+\\$\\.eventName\\s*=\\s*DetachClassicLinkVpc.+\\$\\.eventName\\s*=\\s*DisableVpcClassicLink.+\\$\\.eventName\\s*=\\s*EnableVpcClassicLink"))',
    'is(aws_cloud_trail) and trail_is_multi_region_trail=true and trail_status.is_logging=true with(empty, --> is(aws_cloudwatch_log_group) with(any, --> is(aws_cloudwatch_metric_filter) and filter_pattern~"\\s*\\$\\.eventSource\\s*=\\s*organizations.amazonaws.com.+\\$\\.eventName\\s*=\\s*\\"AcceptHandshake\\".+\\$\\.eventName\\s*=\\s*\\"AttachPolicy\\".+\\$\\.eventName\\s*=\\s*\\"CreateAccount\\".+\\$\\.eventName\\s*=\\s*\\"CreateOrganizationalUnit\\".+\\$\\.eventName\\s*=\\s*\\"CreatePolicy\\".+\\$\\.eventName\\s*=\\s*\\"DeclineHandshake\\".+\\$\\.eventName\\s*=\\s*\\"DeleteOrganization\\".+\\$\\.eventName\\s*=\\s*\\"DeleteOrganizationalUnit\\".+\\$\\.eventName\\s*=\\s*\\"DeletePolicy\\".+\\$\\.eventName\\s*=\\s*\\"DetachPolicy\\".+\\$\\.eventName\\s*=\\s*\\"DisablePolicyType\\".+\\$\\.eventName\\s*=\\s*\\"EnablePolicyType\\".+\\$\\.eventName\\s*=\\s*\\"InviteAccountToOrganization\\".+\\$\\.eventName\\s*=\\s*\\"LeaveOrganization\\".+\\$\\.eventName\\s*=\\s*\\"MoveAccount\\".+\\$\\.eventName\\s*=\\s*\\"RemoveAccountFromOrganization\\".+\\$\\.eventName\\s*=\\s*\\"UpdatePolicy\\".+\\$\\.eventName\\s*=\\s*\\"UpdateOrganizationalUnit\\""))',
    'is(aws_account) with(empty, -[1:2]-> is(aws_iam_role) and name="CloudWatch-CrossAccountSharingRole")',
    'is(aws_cloudwatch_log_group) with(empty, --> is(aws_kms_key))',
    'is(aws_cloudwatch_log_group) and group_retention_in_days<42',
    'is(aws_region) with(empty, --> is(aws_config_recorder) and recorder_status.recording=true and recorder_group.all_supported=true and recorder_status.last_status=SUCCESS)',
    'is(aws_dynamodb_table) and dynamodb_sse_description.sse_type!=KMS',
    'is(aws_ec2_snapshot) and encrypted=false',
    'is(aws_ec2_elastic_ip) with(empty, <-- is(aws_ec2_instance, aws_ec2_network_interface))',
    'is(aws_ec2_instance) and instance_subnet_id==null',
    'is(aws_ec2_instance) and instance_public_ip_address!=null and instance_iam_instance_profile!=null',
    'is(aws_ec2_instance) and instance_status=running and age>42',
    'is(aws_ec2_instance) and instance_iam_instance_profile=null',
    'is(aws_ec2_instance) and instance_status==running and instance_public_ip_address!=null',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{ip_protocol="-1" and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{ip_protocol="-1" and ip_ranges[*].cidr_ip="0.0.0.0/0"}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{ip_protocol="-1" and ipv6_ranges[*].cidr_ipv6="::/0"}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=27017 and to_port<=27017 and ip_protocol=tcp) or (from_port>=27018 and to_port<=27018 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=22 and to_port<=22 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=22 and to_port<=22 and ip_protocol=tcp)) and ip_ranges[*].cidr_ip="0.0.0.0/0"}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=22 and to_port<=22 and ip_protocol=tcp)) and ipv6_ranges[*].cidr_ipv6="::/0"}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=20 and to_port<=20 and ip_protocol=tcp) or (from_port>=21 and to_port<=21 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=3389 and to_port<=3389 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=3389 and to_port<=3389 and ip_protocol=tcp)) and ip_ranges[*].cidr_ip="0.0.0.0/0"}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=3389 and to_port<=3389 and ip_protocol=tcp)) and ipv6_ranges[*].cidr_ipv6="::/0"}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=9160 and to_port<=9160 and ip_protocol=tcp) or (from_port>=8888 and to_port<=8888 and ip_protocol=tcp) or (from_port>=7199 and to_port<=7199 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=9200 and to_port<=9200 and ip_protocol=tcp) or (from_port>=9300 and to_port<=9300 and ip_protocol=tcp) or (from_port>=5601 and to_port<=5601 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=9092 and to_port<=9092 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=11211 and to_port<=11211 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=3306 and to_port<=3306 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=1521 and to_port<=1521 and ip_protocol=tcp) or (from_port>=2483 and to_port<=2483 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=5432 and to_port<=5432 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=6379 and to_port<=6379 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=1433 and to_port<=1433 and ip_protocol=tcp) or (from_port>=1434 and to_port<=1434 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=23 and to_port<=23 and ip_protocol=tcp)) and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")}',
    'is(aws_ec2_security_group) and group_ip_permissions[*].ip_ranges[*].{cidr_ip!="0.0.0.0/0" and cidr_ip!~"^(10\\.|^172\\.(1[6-9]|2[0-9]|3[0-1])\\.|^192\\.168\\.)" and cidr_ip!~"/(2[4-9]|[3][0-2])$"}',
    'is(aws_ec2_security_group) and name="default" and group_ip_permissions[*].{ip_protocol="-1" and (ip_ranges[*].cidr_ip="0.0.0.0/0" or ipv6_ranges[*].cidr_ipv6="::/0")} <-- is(aws_vpc)',
    'is(aws_ec2_volume) and volume_encrypted=false',
    'is(aws_vpc) with(empty, --> is(aws_ec2_flow_log))',
    'is(aws_ec2_instance) and not instance_metadata_options.{(http_endpoint=enabled and http_tokens=required) or http_endpoint=disabled}',
    'is(aws_ec2_instance) and instance_status==stopped and mtime>42',
    'is(aws_ec2_volume) and last_access>7d and volume_attachments==[]',
    'is(aws_ec2_instance) with(empty, <-- is(aws_ssm_instance))',
    'is(aws_ec2_image) and public==true',
    'is(aws_ec2_subnet) and subnet_map_public_ip_on_launch=true',
    'is(aws_ecr_repository) and image_scan_on_push = false',
    'is(aws_ecr_repository) and repository_visibility==public',
    'is(aws_ecr_repository) and lifecycle_policy!=null',
    'is(aws_ecs_task_definition) and network_mode==host and container_definitions[*].{privileged==true or user==root}',
    'is(aws_ecs_task_definition) and container_definitions[*].readonly_root_filesystem!=true',
    'is(aws_ecs_task_definition) and container_definitions[*].log_configuration.log_driver==null',
    'is(aws_efs_file_system) and volume_encrypted==false',
    'is(aws_efs_file_system) and file_system_policy==null',
    'is(aws_eks_cluster) and cluster_resources_vpc_config.endpoint_public_access==true',
    'is(aws_eks_cluster) and cluster_logging.cluster_logging[*].enabled = false',
    'is(aws_eks_cluster) and cluster_encryption_config in [null, []]',
    'is(aws_alb) and alb_listener in [null, []]',
    'is(aws_elb) and listener in [null, []]',
    'is(aws_elb) and elb_attributes.access_log.enabled==false',
    'is(aws_elb) and elb_listener_descriptions[*].{listener.protocol in [HTTPS, SSL] and listener.ssl_certificate_id==null}',
    'is(aws_alb) with (empty, <-- is(aws_waf_web_acl))',
    'is(aws_glacier_vault) and glacier_access_policy.Statement[*].{Effect==Allow and (Principal=="*" or Principal.AWS="*" or Principal.CanonicalUser="*")}',
    'is(aws_root_user) with(any, --> is(access_key))',
    'is(aws_root_user) and mfa_active!=true',
    'is(aws_root_user) and mfa_active==true and user_virtual_mfa_devices!=null and user_virtual_mfa_devices!=[]',
    'is(aws_iam_user) and user_virtual_mfa_devices in [null, []]',
    'is(aws_root_user) {access_keys[]: --> is(access_key)} password_last_used>42 or access_keys[*].reported.access_key_last_used.last_used>42',
    'is(aws_account) and minimum_password_length<14',
    'is(aws_account) and password_reuse_prevention<24',
    'is(aws_iam_user) and password_enabled==true and mfa_active==false',
    'is(aws_iam_access_key) and access_key_status=="Active" and access_key_last_used.last_used==null and /ancestors.aws_iam_user.reported.password_enabled==true',
    'is(aws_iam_user) and password_last_used<42',
    'is(aws_iam_user) {access_keys[]: --> is(access_key)} access_keys[0].reported.access_key_status=="Active" and access_keys[1].reported.access_key_status=="Active"',
    'is(aws_iam_access_key) and access_key_last_used.last_rotated<42',
    'is(aws_iam_user) {attached_policy: --> is(aws_iam_policy)} user_policies!=[] or attached_policy!=null',
    'is(aws_iam_policy) and policy_document.document.Statement[*].{Effect=Allow and (Action in ["*", ["*"]] and Resource in ["*", ["*"]])} and policy_attachment_count>0',
    'is(aws_iam_user) and user_policies[*].policy_document.Statement[*].{Effect=Allow and (Action in ["*", ["*"]] and Resource in ["*", ["*"]])}',
    'is(aws_iam_group) and group_policies[*].policy_document.Statement[*].{Effect=Allow and (Action in ["*", ["*"]] and Resource in ["*", ["*"]])}',
    'is(aws_iam_role) and role_policies[*].policy_document.Statement[*].{Effect=Allow and (Action in ["*", ["*"]] and Resource in ["*", ["*"]])}',
    'is(aws_account) with(empty, -[0:2]-> is(aws_iam_role) and name=AWSServiceRoleForSupport and role_assume_role_policy_document.Statement[*].{Effect=Allow and Principal.Service=support.amazonaws.com and Action="sts:AssumeRole"})',
    'is(aws_iam_server_certificate) and expires<42',
    'is(aws_iam_policy) and name==AWSCloudShellFullAccess <-- is(aws_iam_user, aws_iam_role)',
    'is(aws_account) and require_lowercase_characters=false',
    'is(aws_account) and require_numbers=false',
    'is(aws_account) and require_symbols=false',
    'is(aws_account) and require_uppercase_characters=false',
    'is(aws_iam_access_key) and age>42 and (last_used==null or last_used<42)',
    'is(aws_account) and (expire_passwords!=true or max_password_age>42)',
    'is(aws_kms_key) and kms_key_manager==CUSTOMER and access_key_status=Enabled and kms_key_rotation_enabled=false',
    'is(aws_kms_key) and access_key_status==PendingDeletion with(any, <-- not is(region))',
    'is(aws_kms_key) and kms_key_policy.Statement[*].{ Effect==Allow and Principal=="*" and Action in ["*", "kms:*"] and Condition==null}',
    'is(aws_lambda_function) and function_policy.statement[*].{principal~"*" or principal.AWS~"*" or principal.CanonicalUser~"*"}',
    'is(aws_lambda_function) with (empty, <-- is(aws_vpc))',
    'is(aws_lambda_function) and function_url_config.cors.allow_origins ~ "*"',
    'is(aws_lambda_function) and function_url_config != null and function_url_config.auth_type != AWS_IAM',
    'is(aws_lambda_function) and function_runtime in [python3.6, python2.7, dotnetcore2.1, ruby2.5, nodejs10.x, nodejs8.10, nodejs4.3, nodejs6.10, dotnetcore1.0, dotnetcore2.0, nodejs4.3-edge, nodejs]',
    'is(aws_opensearch_domain) and advanced_security_options.internal_user_database_enabled==true',
    'is(aws_opensearch_domain) and access_policies.Statement[*].{Effect=="Allow" and (Principal.AWS="*" or Principal="*") and (Condition==null or Condition.IpAddress.`aws:SourceIp`[] in ["*", "0.0.0.0/0"])}',
    'is(aws_opensearch_domain) and cognito_options==null',
    'is(aws_opensearch_domain) and log_publishing_options.AUDIT_LOGS.enabled in [null, false]',
    'is(aws_opensearch_domain) and service_software_options.update_available==true',
    'is(aws_opensearch_domain) and encryption_at_rest_options.enabled=false',
    'is(aws_account) and is_organization_member=False',
    'is(aws_rds_instance) and volume_encrypted==false',
    'is(aws_rds_instance) and rds_auto_minor_version_upgrade==false',
    'is(aws_rds_instance) and rds_enabled_cloudwatch_logs_exports==[]',
    'is(aws_rds_instance) and db_publicly_accessible==true',
    'is(aws_rds_cluster_snapshot, aws_rds_snapshot) and rds_attributes.restore[*]=="all"',
    'is(aws_redshift_cluster) and redshift_logging_status.logging_enabled=false',
    'is(aws_redshift_cluster) and redshift_publicly_accessible=true and redshift_endpoint.address!=null',
    'is(aws_redshift_cluster) and redshift_allow_version_upgrade=false',
    'is(aws_route53_zone) and zone_logging_config==null',
    'is(aws_s3_bucket) and bucket_encryption_rules[*].{sse_algorithm==null}',
    'is(aws_s3_bucket) and bucket_versioning=true and bucket_mfa_delete=false',
    'is(aws_s3_bucket) and bucket_policy!=null and bucket_public_access_block_configuration.restrict_public_buckets==false',
    'is(aws_s3_bucket) {account_setting: <-[0:]- is(aws_account) --> is(aws_s3_account_settings)} (bucket_public_access_block_configuration.block_public_acls==false and account_setting.reported.bucket_public_access_block_configuration.block_public_acls==false) or (bucket_public_access_block_configuration.ignore_public_acls==false and account_setting.reported.bucket_public_access_block_configuration.ignore_public_acls==false) or (bucket_public_access_block_configuration.block_public_policy==false and account_setting.reported.bucket_public_access_block_configuration.block_public_policy==false) or (bucket_public_access_block_configuration.restrict_public_buckets==false and account_setting.reported.bucket_public_access_block_configuration.restrict_public_buckets==false)',
    'is(aws_s3_bucket) and bucket_public_access_block_configuration.{block_public_acls!=true or ignore_public_acls!=true or block_public_policy!=true or restrict_public_buckets!=true} or bucket_acl.grants[*].{permission in [READ, READ_ACP] and grantee.uri=="http://acs.amazonaws.com/groups/global/AllUsers"}',
    'is(aws_s3_bucket) and bucket_logging==null',
    'is(aws_sagemaker_notebook) and notebook_root_access==Enabled',
    'is(aws_sagemaker_notebook) and notebook_direct_internet_access=="Enabled"',
    'is(aws_sagemaker_model) and model_enable_network_isolation=false',
    'is(aws_sagemaker_model) and model_vpc_config.subnets in [null, []]',
    'is(aws_sagemaker_notebook) with(empty, <-- is(aws_ec2_subnet))',
    'is(aws_sagemaker_training_job) and training_job_enable_network_isolation=false',
    'is(aws_sagemaker_notebook) with(empty, --> is(aws_kms_key))',
    'is(aws_sagemaker_training_job) and training_job_enable_inter_container_traffic_encryption=false',
    'is(aws_sagemaker_training_job) and training_job_resource_config.volume_kms_key_id==null',
    'is(aws_secretsmanager_secret) and rotation_enabled==false',
    'is(aws_secretsmanager_secret) and last_accessed_date < 42',
    'is(aws_secretsmanager_secret) and last_changed_date<42',
    'is(aws_sns_topic) with(empty, --> is(aws_kms_key))',
    'is(aws_sqs_queue) and sqs_managed_sse_enabled==false and sqs_kms_master_key_id==null',
    'is(aws_ssm_document) and document_shared_with_accounts not in [null, []]',
    'is(aws_ssm_resource_compliance) --> is(aws_ec2_instance, aws_dynamodb_table, aws_ssm_document, aws_s3_bucket)',
    'is(aws_waf_web_acl) and logging_configuration==null',
    'with_usage(7d, cpu_utilization_percent) is(instance,database) and /usage.cpu_utilization_percent.max < 10',
    '/ancestors.account.reported.id="123456789012"',
  ]

  for (const query of queries) {
    try {
      const q = parse_query(query)
      assert.deepEqual(q, parse_query(q.toString()))
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Failed to parse query: ${query}: ${e}`)
    }
  }
})

test('Parse s3 bucket query', () => {
  const parsed = parse_query(
    'is(aws_s3_bucket) {account_setting: <-- is(aws_account) --> is(aws_s3_account_settings)} account_setting.reported.bucket_public_access_block_configuration.{block_public_acls != true or ignore_public_acls != true or block_public_policy != true or restrict_public_buckets != true} and bucket_public_access_block_configuration.{block_public_acls != true or ignore_public_acls != true or block_public_policy != true or restrict_public_buckets != true} and (bucket_acl.grants[*].{permission in ["READ","READ_ACP","WRITE","WRITE_ACP","FULL_CONTROL"] and grantee.uri = "http://acs.amazonaws.com/groups/global/AllUsers"} or bucket_policy.Statement[*].{Effect = "Allow" and (Principal = "*" or Principal.AWS = "*" or Principal.CanonicalUser = "*") and (Action in ["s3:GetObject","s3:PutObject","s3:Get*","s3:Put*","s3:*","*"] or Action[*] in ["s3:GetObject","s3:PutObject","s3:Get*","s3:Put*","s3:*","*"])})',
  )
  assert.strictEqual(parsed.parts.length, 1)
  const term = parsed.parts[0].term as MergeTerm
  assert.strictEqual(term.preFilter instanceof IsTerm, true)
  assert.strictEqual(term.postFilter instanceof CombinedTerm, true)
})
