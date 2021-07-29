import { getCustomRepository } from "typeorm"
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories"
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IComplimentRequest {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
  message: string;
}

class CreateComplimentService {
  async execute({ tag_id, user_sender, user_receiver, message }: IComplimentRequest) {
    const complimentRepository = getCustomRepository(ComplimentsRepositories);
    const usersRepositories = getCustomRepository(UsersRepositories);

    if(user_sender === user_receiver) {
      throw new Error("You can't send a compliment to yourself");
    }

    const userReceiverExists = await usersRepositories.findOne(user_receiver);
    if (!userReceiverExists) {
      throw new Error("User Receiver does not exist");
    }

    const compliment = complimentRepository.create({
      tag_id,
      user_sender,
      user_receiver,
      message
    });

    await complimentRepository.save(compliment);

    return compliment;
  }

}

export { CreateComplimentService }