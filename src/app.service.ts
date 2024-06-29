import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getInformation(username: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    let age: number;

    if (user) {
      try {
        // JSONデータをパースして年齢を取得する
        const profileData = JSON.parse(user.value);
        const ageField = profileData.fields.find((field) => field.id === 'age');

        if (ageField && typeof ageField.value === 'number') {
          age = ageField.value;
        } else {
          throw new Error('Age field not found or invalid');
        }
      } catch (error) {
        console.error('Error parsing user profile data:', error);
        age = 99; // デフォルトの年齢を設定
      }
    } else {
      age = 99; // デフォルトの年齢を設定
    }

    return { age };
  }
}
