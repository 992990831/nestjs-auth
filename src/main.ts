import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'; 
import * as connectRedis from 'connect-redis'; 
import * as redis from 'redis'; 
import * as passport from 'passport'; 

const RedisStore = connectRedis(session); 

// 设置redis链接参数，具体参考 https://www.npmjs.com/package/redis 
const redisClient = redis.createClient(6379, '127.0.0.1'); 

// 设置passport序列化和反序列化user的方法，在将用户信息存储到session时使用 
passport.serializeUser(function(user, done) { 
  done(null, user); 
}); 
// 反序列化 
passport.deserializeUser(function(user, done) { 
  done(null, user); 
}); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use( 
    session({ 
      secret: 'demo-session-secret', //加密session时所使用的密钥
      resave: false, 
      saveUninitialized: false, 
      // 使用redis存储session 
      store: new RedisStore({ client: redisClient }),  
    }), 
  ); 
  // 设置passport，并启用session 
  app.use(passport.initialize()); 
  app.use(passport.session()); 


  await app.listen(3000);
}
bootstrap();
