# Bước 1: Sử dụng hình ảnh có Node.js để xây dựng ứng dụng React Vite
FROM node:18-alpine as build

WORKDIR /chp

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Bước 2: Sử dụng hình ảnh có Nginx để phục vụ ứng dụng đã xây dựng
FROM nginx:alpine

# Sao chép tệp build từ hình ảnh Node.js
COPY --from=build /chp/dist /usr/share/nginx/html/

# Mở cổng 80 để Nginx có thể phục vụ ứng dụng
EXPOSE 80

# Command để chạy Nginx khi container được khởi chạy
CMD ["nginx", "-g", "daemon off;"]
