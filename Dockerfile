# Image בסיס עם Node
FROM node:22-alpine

WORKDIR /app

# קודם package.json, כדי ש-Docker ישמור את npm install ב-cache
COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Railway קובע את PORT בעצמו. 3000 הוא ברירת מחדל להרצה מקומית
ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
