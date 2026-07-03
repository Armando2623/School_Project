# Fase 1: Compilación
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Fase 2: Ejecución (Línea corregida)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/Proyecto-0.0.1.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]