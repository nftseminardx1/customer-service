// form/form.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as formJson from '../data/form.json';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(username: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      return JSON.parse(user.value); // JSONデータをパースして返す
    } else {
      return formJson;
    }
  }

  async updateProfile(username: string, formData: any): Promise<any> {
    // formJsonのコピーを作成し、必要なフィールドのみを更新
    let updatedFields = formJson.fields.map(field => {
      if (formData[field.id] !== undefined) {
        return { ...field, value: formData[field.id] };
      }
      return field;
    });

    // メッセージを更新
    let updatedData = {
      fields: updatedFields,
      message: "データが正常に更新されました。"
    };

    // ユーザーエンティティを検索または新規作成
    let user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      user = new User();
      user.username = username;
    }

    user.value = JSON.stringify(updatedData);

    await this.userRepository.save(user);
    return { message: 'Profile updated successfully' };
  }

  async deleteProfile(username: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      await this.userRepository.remove(user);
      return { message: 'Profile deleted successfully' };
    } else {
      return { message: 'User not found' };
    }
  }
}
