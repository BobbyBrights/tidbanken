export class Message {
  is_waiting:boolean;
  user_id:number;
  text:string;

  constructor(text:string, user_id:number) {
    this.text = text;
    this.user_id = user_id;
  }
}
