type Channels = {
  email: boolean;
  slack: boolean;
};

export const getDefaultChannels = (eventType: string) => {
  const rules = {
    USER_REGISTERED: {
      email: true,
      slack: false,
    },
    PASSWORD_RESET: {
      email: true,
      slack: false,
    },
    ORDER_PLACED: {
      email: true,
      slack: false,
    },
  };

  return rules[eventType] || { email: false, slack: false };
};

export const resolveChannels = (event: any): Promise<Channels> => {
  return getDefaultChannels(event.eventType);
};