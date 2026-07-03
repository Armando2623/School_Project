# Fase 1: Compilación
FROM maven:3.8.8-eclipse-temurin-217 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests -Dmaven.resources.filtering=false

# Fase 2: Ejecución
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/Proyecto-0.0.1.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]