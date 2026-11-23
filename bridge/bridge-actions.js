// The actions MathHelper shares with other agent sites, through its action bridge.
// The build names this file in bridge/agent-manifest.json. When another site's assistant
// calls this site, the bridge loads it in a hidden frame on this site's origin, which has
// no page. Only the names in the manifest's "actions.agentTools" reach a partner's agents.
//
// This shares PUBLIC facts only: the topic catalog, lessons and practice problems.
// It never shares a visitor's practice history or scores.
import { TOPICS } from "../topics.js";

class BridgeActions {
  // Public facts the page already shows: share with every site on the web.
  static CALLERS = ["*"];

  static registerActions(actions) {
    actions.register(BridgeActions.readStateAction());
    actions.register(BridgeActions.getTopicAction());
    actions.register(BridgeActions.getPracticeAction());
  }

  static readStateAction() {
    return {
      // Same name and input as the page's own action, so the network's instructions fit both.
      name: "get_math_state",
      description: "Read the public MathHelper topic catalog (id, title, subject, blurb, number of practice problems) and the page facts, including what MathHelper cannot do. Changes nothing. Call it before answering about topics. This bridge read has no visitor data: no practice history or scores.",
      effect: "read",
      availability: "bridge",
      callerOrigins: BridgeActions.CALLERS,
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: () => BridgeActions.readState(),
    };
  }

  static readState() {
    return {
      ok: true,
      topics: TOPICS.map(t => ({ id: t.id, title: t.title, subject: t.subject, blurb: t.blurb, problems: t.problems.length })),
      facts: "MathHelper is a static math practice site. It offers 4 topics (Solving Equations, Fractions of a Number, Percentages in Money, Area & Perimeter), each with a short lesson and 5 practice problems with worked steps. It cannot solve problems outside these four topics, or grade official schoolwork."
    };
  }

  static getTopicAction() {
    return {
      name: "get_math_topic",
      description: "Read the full lesson (key points) for one MathHelper topic, and how many practice problems it has. Call it before explaining a topic. Changes nothing.",
      effect: "read",
      availability: "bridge",
      callerOrigins: BridgeActions.CALLERS,
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["topicId"],
        properties: {
          topicId: { type: "string", enum: TOPICS.map(t => t.id), description: "Topic id from the bridge get_math_state." },
        },
      },
      execute: (args) => BridgeActions.getTopic(args.topicId),
    };
  }

  static getTopic(topicId) {
    const t = TOPICS.find(x => x.id === topicId);
    if (!t) return { ok: false, reason: "Unknown topic id: " + topicId + ". Available topics: " + TOPICS.map(x => x.id).join(", ") + "." };
    return { ok: true, id: t.id, title: t.title, subject: t.subject, lesson: t.lesson, problemCount: t.problems.length };
  }

  static getPracticeAction() {
    return {
      name: "get_practice",
      description: "Read the practice problems for one MathHelper topic, without their answers. Call it before giving practice problems. Changes nothing.",
      effect: "read",
      availability: "bridge",
      callerOrigins: BridgeActions.CALLERS,
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["topicId"],
        properties: {
          topicId: { type: "string", enum: TOPICS.map(t => t.id), description: "Topic id from the bridge get_math_state." },
        },
      },
      execute: (args) => BridgeActions.getPractice(args.topicId),
    };
  }

  static getPractice(topicId) {
    const t = TOPICS.find(x => x.id === topicId);
    if (!t) return { ok: false, reason: "Unknown topic id: " + topicId + "." };
    return { ok: true, topicId: t.id, title: t.title, problems: t.problems.map((p, i) => ({ n: i + 1, q: p.q })) };
  }
}

export const registerActions = BridgeActions.registerActions;
