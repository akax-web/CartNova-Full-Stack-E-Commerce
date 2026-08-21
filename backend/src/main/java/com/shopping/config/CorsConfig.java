package com.shopping.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration for the CartNova REST API.
 *
 * Allowed origins:
 *   - Local Vite dev server (http://localhost:5173 / 127.0.0.1)
 *   - GitHub Pages production frontend
 *
 * If you deploy the backend behind a custom domain, add that origin here.
 * For production with credentials (JWT), a wildcard origin ("*") cannot be used.
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://127.0.0.1:5173",
                                "https://akax-web.github.io"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
