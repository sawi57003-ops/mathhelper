// Registers MathHelper's operations with the agent runtime.
// agent-manifest.json loads this module through "actions.module". Only the names in
// "actions.agentTools" become model tools, called website_<name>.
//
// Operations return {ok: false, reason} when they refuse input, before changing
// anything, and throw only on unexpected failures. A throw is reported as "unknown".
// Import the page script by the same URL the page uses (no ?v= query), or the actions
// get a second, separate copy of the page state.
import { App } from "./script.js";

// Topic ids, built from the real catalog so the model cannot invent a topic.
const TOPIC_IDS = App.page.getState().topics.map(t => t.id);

class SiteActions {
  static registerActions(actions) {
    actions.register(SiteActions.getMathStateAction());
    actions.register(SiteActions.getMathTopicAction());
    actions.register(SiteActions.getPracticeAction());
    actions.register(SiteActions.checkPracticeAnswerAction());
  }

  static getMathStateAction() {
    return {
      name: "get_math_state",
      description: "Read the actual math topics, the visitor's practice score and history on this page. Call it before answering about topics or scores, and again in each turn that needs it: the visitor can also use the page. Returns the page facts too, including what MathHelper cannot do.",
      effect: "read",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: () => App.page.getState(),
    };
  }

  static getMathTopicAction() {
    return {
      name: "get_math_topic",
      description: "Read the full lesson (key points) for one math topic, and how many practice problems it has. Call it before explaining a topic or giving practice, and again in each turn that needs it. Does not show the problems; use website_get_practice for those.",
      effect: "read",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["topicId"],
        properties: {
          topicId: { type: "string", enum: TOPIC_IDS, description: "Topic id from website_get_math_state." },
        },
      },
      execute: (args) => App.page.getTopic(args.topicId),
    };
  }

  static getPracticeAction() {
    return {
      name: "get_practice",
      description: "Read the practice problems for one math topic, without their answers. Call it before giving the visitor practice problems. The answers stay in the site's data; use website_check_practice_answer to check an answer. Does not check anything.",
      effect: "read",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["topicId"],
        properties: {
          topicId: { type: "string", enum: TOPIC_IDS, description: "Topic id from website_get_math_state." },
        },
      },
      execute: (args) => App.page.getPractice(args.topicId),
    };
  }

  static checkPracticeAnswerAction() {
    return {
      name: "check_practice_answer",
      description: "Check the visitor's answer to one practice problem. Call it only when the visitor asks, after they give an answer as a plain number. In the same turn, first call website_get_practice to confirm the problem number. Returns whether it is correct, the correct answer and the worked steps, and records it in the practice history. The visitor can try another problem afterwards.",
      effect: "write",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["topicId", "problemNumber", "userAnswer"],
        properties: {
          topicId: { type: "string", enum: TOPIC_IDS, description: "Topic id from website_get_math_state." },
          problemNumber: { type: "integer", minimum: 1, maximum: 5, description: "Problem number from website_get_practice, 1 to 5." },
          userAnswer: { type: "number", description: "The visitor's answer as a plain number." },
        },
      },
      execute: (args) => App.page.checkPracticeAnswer(args.topicId, args.problemNumber, args.userAnswer),
    };
  }
}

export const registerActions = SiteActions.registerActions;
