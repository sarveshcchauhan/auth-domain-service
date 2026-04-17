export const TOPICS = {
  USER_EVENTS: "user-events",

  // EMAIL
  RETRY_EMAIL_1M: "retry.1m.user.events",
  RETRY_EMAIL_5M: "retry.5m.user.events",
  RETRY_EMAIL_30M: "retry.30m.user.events",
  
  //SLACK
  RETRY_SLACK_1M: "retry.slack.1m", 
  RETRY_SLACK_5M: "retry.slack.5m", 
  RETRY_SLACK_30M: "retry.slack.30m",
  
  //DLQ
  DLQ_TOPIC_EMAIL: "dlq.email.v1",
  DLQ_TOPIC_SLACK: "dlq.slack.v1",
  
  //UPGRADE FOR FUTURE
  BUSINESS: "business.events",
  NOTIFY_EMAIL: "notify.email",
  NOTIFY_SLACK: "notify.slack",
  NOTIFY_PUSH: "notify.push",
};