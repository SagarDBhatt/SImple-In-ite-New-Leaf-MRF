package net.RevolutionSystems.SimpleIn$ite.payload;

import java.util.List;

public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String name;
    private List<String> roles;

    public JwtAuthenticationResponse(String accessToken,Long id, String username, String email, List<String> roles, String name) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
