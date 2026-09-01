export const normalizePhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber?.startsWith("09") || phoneNumber?.startsWith("07")) {
    return phoneNumber?.slice(4);
  } else if (phoneNumber?.startsWith("+251")) {
    return phoneNumber?.slice(4);
  } else if (phoneNumber?.startsWith("251")) {
    return phoneNumber?.slice(3);
  }
  return phoneNumber;
};
