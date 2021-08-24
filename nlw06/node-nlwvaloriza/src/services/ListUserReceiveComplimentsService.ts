import { getCustomRepository } from "typeorm";
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";

class ListUserReceiveComplimentsService {

  async execute(user_id: string){
    const complimentsRepositories = getCustomRepository(ComplimentsRepositories);

    const userReceiveCompliments = await complimentsRepositories.find({
      where: {
        user_receiver: user_id
      },
      relations: ['userReceiver', 'userReceiver', 'tag']
    });

    return userReceiveCompliments;
  }
}

export { ListUserReceiveComplimentsService }