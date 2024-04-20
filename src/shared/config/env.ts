import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class Env {
  @IsNotEmpty()
  @IsString()
  jwtSecret: string;
}

export const env: Env = plainToInstance(Env, {
  jwtSecret: process.env.JWT_SECRET,
});

const erros = validateSync(env);

if (erros.length > 0) {
  throw new Error(JSON.stringify(erros, null, 2));
}
