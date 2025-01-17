class TwitchCommand{
  name : string;
  commands : Array<string>;
  roles : Array<string>;
  constructor(name : string, commands : Array<string>, roles : Array<string>){
    this.name = name;
    this.commands = commands;
    this.roles = roles;
  }
}

const commands = [
    new TwitchCommand("Giphy",["!giphy"],["Everyone"]),
    new TwitchCommand("Gif",["!gif"],["Moderator"])
]
const CommandGen = (commands : Array<TwitchCommand>) => commands.reduce((acc, x) => {
    acc[x.name] = x.commands;
    return acc;
  }, {});

export const Command = CommandGen(commands);

export const MatchCommand = (command: string[] | string, message: string) => {
  // Se o comando for array, retorna true se um dos items do array coincidir
  //com o começo da mensagem
  if (command instanceof Array) {
    const cmd = command.find((val) => {
      return message.startsWith(val);
    });
    return cmd != undefined;
  }
  // Se o comando for string, retorna o resultado de startsWith
  return message.startsWith(command);
};

export const GetArgs = (command: string[] | string, message: string) => {
  // Se o comando é array, identifica o comando usado,
  // depois remova-o da mensagem
  if (command instanceof Array) {
    const cmd = command.find((val) => {
      return message.startsWith(val);
    });
    return message
      .substring(cmd.length)
      .trim()
      .replace(/[^\w\s!?]/g, "");
  }

  // Se o comando é string, substring
  return message
    .substring(command.length)
    .trim()
    .replace(/[^\w\s!?]/g, "");
};

export const IsUserAllowed = (messagePayload : any,allowedRoles) => {
  let isAllowed = false;

  if (allowedRoles.includes("Everyone")) {
    isAllowed = true;
  }

  if (allowedRoles.includes("VIP") && !isAllowed) {
    isAllowed = messagePayload.tags.badges.vip;
  }
  if (allowedRoles.includes("Moderator") && !isAllowed) {
    isAllowed = messagePayload.tags.isModerator;
  }

  if(allowedRoles.includes("Subscriber") && !isAllowed){
    isAllowed = `#${messagePayload.subscriber}` === "1"
  }

  //owner is always allowed to do everything,even if not defined
  if(!isAllowed ){
    isAllowed = `#${messagePayload.username}` === messagePayload.channel
  }

  console.log(isAllowed)
  return isAllowed;

}
