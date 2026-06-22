import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { ApolloServerPluginSchemaReporting } from '@apollo/server/plugin/schemaReporting';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import type { Context } from 'graphql-ws';

type WsExtra = {
  userId?: string;
  connectionId?: string;
  user?: unknown;
  session?: unknown;
  headers?: Record<string, string>;
};

type WsContext = Context<Record<string, unknown> | undefined, WsExtra>;

export const GqlConfig = GraphQLModule.forRootAsync<ApolloDriverConfig>({
  imports: [ConfigModule],
  inject: [ConfigService],
  driver: ApolloDriver,
  useFactory: async (configService: ConfigService) => {
    const isProduction = configService.get('NODE_ENV') === 'production';
    return {
      playground: false, // Disabled in favor of Apollo Sandbox
      plugins: [
        isProduction
          ? ApolloServerPluginLandingPageProductionDefault({
              graphRef: configService.get('APOLLO_GRAPH_REF')!,
              embed: true,
              includeCookies: true, // Enable cookie support for authentication
            })
          : ApolloServerPluginLandingPageLocalDefault(),
        // Enable Apollo Studio reporting in production
        ...(isProduction && configService.get('APOLLO_KEY')
          ? [
              ApolloServerPluginUsageReporting(),
              ApolloServerPluginSchemaReporting(),
              ApolloServerPluginInlineTrace(),
            ]
          : []),
      ],
      autoSchemaFile: isProduction
        ? true
        : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: (ctx) => {
        if ('req' in ctx && ctx.req) {
          return ctx;
        }

        const wsContext = ctx as WsContext;
        const req = {
          headers: wsContext.extra?.headers ?? {},
          user: wsContext.extra?.user,
          session: wsContext.extra?.session,
        };

        return {
          req,
          user: wsContext.extra?.user,
          session: wsContext.extra?.session,
          connectionParams: wsContext.connectionParams,
          extra: wsContext.extra,
        };
      },
      // Apollo Studio configuration for schema reporting
      apollo:
        isProduction && configService.get('APOLLO_KEY')
          ? {
              key: configService.get('APOLLO_KEY'),
              graphRef: configService.get('APOLLO_GRAPH_REF'),
            }
          : undefined,
      introspection: true, // Enable in all environments for Apollo Sandbox
    };
  },
});
