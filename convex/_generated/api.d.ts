/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminMaintenance from "../adminMaintenance.js";
import type * as aiGreetings from "../aiGreetings.js";
import type * as apiKeys from "../apiKeys.js";
import type * as billingNotifications from "../billingNotifications.js";
import type * as budget from "../budget.js";
import type * as businessGoals from "../businessGoals.js";
import type * as cancellationSurveys from "../cancellationSurveys.js";
import type * as chatbotAnalytics from "../chatbotAnalytics.js";
import type * as coachAI from "../coachAI.js";
import type * as coachMessages from "../coachMessages.js";
import type * as coachNotifications from "../coachNotifications.js";
import type * as crons from "../crons.js";
import type * as dailyCheckIns from "../dailyCheckIns.js";
import type * as dailyPlans from "../dailyPlans.js";
import type * as deepScan from "../deepScan.js";
import type * as dodo from "../dodo.js";
import type * as emailAutomation from "../emailAutomation.js";
import type * as fitness from "../fitness.js";
import type * as focusSessions from "../focusSessions.js";
import type * as gamification from "../gamification.js";
import type * as goalTemplates from "../goalTemplates.js";
import type * as goals from "../goals.js";
import type * as growthAnalytics from "../growthAnalytics.js";
import type * as habitStacks from "../habitStacks.js";
import type * as habits from "../habits.js";
import type * as http from "../http.js";
import type * as insights from "../insights.js";
import type * as leads from "../leads.js";
import type * as lib_transactions from "../lib/transactions.js";
import type * as marketing from "../marketing.js";
import type * as metaMarketing from "../metaMarketing.js";
import type * as milestones from "../milestones.js";
import type * as nutrition from "../nutrition.js";
import type * as partnerEngine from "../partnerEngine.js";
import type * as payments from "../payments.js";
import type * as psychology from "../psychology.js";
import type * as pushNotifications from "../pushNotifications.js";
import type * as recovery from "../recovery.js";
import type * as referrals from "../referrals.js";
import type * as reminders from "../reminders.js";
import type * as restApi from "../restApi.js";
import type * as scratchNotes from "../scratchNotes.js";
import type * as sleep from "../sleep.js";
import type * as tasks from "../tasks.js";
import type * as telegram from "../telegram.js";
import type * as telegramActions from "../telegramActions.js";
import type * as users from "../users.js";
import type * as visionBoards from "../visionBoards.js";
import type * as webhooks from "../webhooks.js";
import type * as weeklyReviews from "../weeklyReviews.js";
import type * as wellness from "../wellness.js";
import type * as wishlist from "../wishlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminMaintenance: typeof adminMaintenance;
  aiGreetings: typeof aiGreetings;
  apiKeys: typeof apiKeys;
  billingNotifications: typeof billingNotifications;
  budget: typeof budget;
  businessGoals: typeof businessGoals;
  cancellationSurveys: typeof cancellationSurveys;
  chatbotAnalytics: typeof chatbotAnalytics;
  coachAI: typeof coachAI;
  coachMessages: typeof coachMessages;
  coachNotifications: typeof coachNotifications;
  crons: typeof crons;
  dailyCheckIns: typeof dailyCheckIns;
  dailyPlans: typeof dailyPlans;
  deepScan: typeof deepScan;
  dodo: typeof dodo;
  emailAutomation: typeof emailAutomation;
  fitness: typeof fitness;
  focusSessions: typeof focusSessions;
  gamification: typeof gamification;
  goalTemplates: typeof goalTemplates;
  goals: typeof goals;
  growthAnalytics: typeof growthAnalytics;
  habitStacks: typeof habitStacks;
  habits: typeof habits;
  http: typeof http;
  insights: typeof insights;
  leads: typeof leads;
  "lib/transactions": typeof lib_transactions;
  marketing: typeof marketing;
  metaMarketing: typeof metaMarketing;
  milestones: typeof milestones;
  nutrition: typeof nutrition;
  partnerEngine: typeof partnerEngine;
  payments: typeof payments;
  psychology: typeof psychology;
  pushNotifications: typeof pushNotifications;
  recovery: typeof recovery;
  referrals: typeof referrals;
  reminders: typeof reminders;
  restApi: typeof restApi;
  scratchNotes: typeof scratchNotes;
  sleep: typeof sleep;
  tasks: typeof tasks;
  telegram: typeof telegram;
  telegramActions: typeof telegramActions;
  users: typeof users;
  visionBoards: typeof visionBoards;
  webhooks: typeof webhooks;
  weeklyReviews: typeof weeklyReviews;
  wellness: typeof wellness;
  wishlist: typeof wishlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  dodopayments: {
    lib: {
      checkout: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          environment: "test_mode" | "live_mode";
          payload: {
            allowed_payment_method_types?: Array<string>;
            billing_address?: {
              city?: string;
              country: string;
              state?: string;
              street?: string;
              zipcode?: string;
            };
            billing_currency?: string;
            confirm?: boolean;
            customer?:
              | { email: string; name?: string; phone_number?: string }
              | { customer_id: string };
            customization?: {
              force_language?: string;
              show_on_demand_tag?: boolean;
              show_order_details?: boolean;
              theme?: string;
            };
            discount_code?: string;
            feature_flags?: {
              allow_currency_selection?: boolean;
              allow_discount_code?: boolean;
              allow_phone_number_collection?: boolean;
              allow_tax_id?: boolean;
              always_create_new_customer?: boolean;
            };
            force_3ds?: boolean;
            metadata?: Record<string, string>;
            product_cart: Array<{
              addons?: Array<{ addon_id: string; quantity: number }>;
              amount?: number;
              product_id: string;
              quantity: number;
            }>;
            return_url?: string;
            show_saved_payment_methods?: boolean;
            subscription_data?: {
              on_demand?: {
                adaptive_currency_fees_inclusive?: boolean;
                mandate_only: boolean;
                product_currency?: string;
                product_description?: string;
                product_price?: number;
              };
              trial_period_days?: number;
            };
          };
        },
        { checkout_url: string }
      >;
      customerPortal: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          dodoCustomerId: string;
          environment: "test_mode" | "live_mode";
          send_email?: boolean;
        },
        { portal_url: string }
      >;
    };
  };
};
