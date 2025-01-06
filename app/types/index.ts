export type Error = {
    email:string,
    password:string,
  }
  export  type Message = {
    errors: Error,
    success: string,
  }
  export type Props = {
    message: Message,
  }