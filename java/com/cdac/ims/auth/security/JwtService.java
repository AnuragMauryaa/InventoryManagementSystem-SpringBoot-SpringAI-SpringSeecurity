package com.cdac.ims.auth.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key key;

    @PostConstruct
    public void init() {

        key = Keys.hmacShaKeyFor(secret.getBytes());

    }

    public String generateToken(UserDetails userDetails){

        return Jwts.builder()

                .setSubject(userDetails.getUsername())

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )

                .signWith(key, SignatureAlgorithm.HS256)

                .compact();

    }

    public String extractUsername(String token){

        return getClaims(token).getSubject();

    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ){

        String username =
                extractUsername(token);

        return username.equals(userDetails.getUsername())
                &&
                !isTokenExpired(token);

    }

    private boolean isTokenExpired(String token){

        return getClaims(token)
                .getExpiration()
                .before(new Date());

    }

    private Claims getClaims(String token){

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody();

    }

}