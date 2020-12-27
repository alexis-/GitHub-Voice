export default class Reactions {
  constructor(reactions: any) {
    this.url = reactions.url;
    this['+1'] = reactions['+1'];
  }

  url: string;
  '+1': number;
}
