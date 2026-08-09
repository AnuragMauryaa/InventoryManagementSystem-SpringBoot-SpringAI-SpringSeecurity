# ==========================================
# Stage 1: Build Spring Boot application
# ==========================================

FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven configuration
COPY pom.xml .

# Your repository stores backend Java sources in /java
# Map them to Maven's standard /src/main/java
COPY java ./src/main/java

# Your repository stores resources in /resources
# Map them to Maven's standard /src/main/resources
COPY resources ./src/main/resources

# Build Spring Boot application
RUN mvn clean package -DskipTests


# ==========================================
# Stage 2: Run Spring Boot application
# ==========================================

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the generated Spring Boot JAR
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
