export type Error = {
  email: string;
  password: string;
  name?: string;
};
export type Message = {
  errors: Error;
  success: string;
};
export type Input = {
  id: string;
  name: string;
  type: string;
  message: Message;
};
export type Props = {
  message: Message;
};
