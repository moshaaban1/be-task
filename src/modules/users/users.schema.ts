import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
class User {
  @Prop({ require: true })
  name: string;

  @Prop({ require: true, unique: true })
  email: string;

  @Prop({
    require: true,
    select: false,
  })
  password: string;

  @Prop({ default: null })
  image: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password);
  next();
});

export { User, UserSchema };
