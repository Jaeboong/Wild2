# 베이스 이미지 설정
FROM node:18

# 애플리케이션 디렉터리 생성
WORKDIR /app

# 패키지 파일을 복사
COPY package*.json ./

# 나머지 패키지 설치 (bcrypt 제외)
RUN npm install --ignore-scripts && npm cache clean --force

# bcrypt 모듈 설치
RUN npm install bcrypt --build-from-source

# 애플리케이션 소스 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 애플리케이션 시작 명령어
CMD ["npm", "start"]