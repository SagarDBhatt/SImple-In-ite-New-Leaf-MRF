# ONSJHJSA 

### Authentication and Authorization 

### Spring Security, JWT access token, AuthenticationManager : 

1. Create a spring boot application. Add "Json Web Toke" and "Spring Security" dependencies. 

2. Configure data source in "application.property" file. 
  
#### Server Properties
	server.port= 5000

#### Spring DATASOURCE (DataSourceAutoConfiguration & DataSourceProperties)
	spring.datasource.url= jdbc:mysql://localhost:3306/SimpleIn$ite;integratedSecurity=true
	spring.datasource.username= SBhatt/freeware
	spring.datasource.password= ""

#### Hibernate Properties

#### The SQL dialect makes Hibernate generate better SQL for the chosen database

	spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.MySQL5InnoDBDialect
	spring.jpa.hibernate.ddl-auto = update  // If table is not present then create one. If already presents then update the columns if needed. 

#### Hibernate Logging
logging.level.org.hibernate.SQL= DEBUG

#### Initialize the datasource with available DDL and DML scripts
spring.datasource.initialization-mode=always


3. Optional Step: To change the timezone to UTC. Earlier it was ITC. Timezone might not impact much. 

@SpringBootApplication
@EntityScan(basePackageClasses = { 
		PollsApplication.class,
		Jsr310JpaConverters.class 
})
public class SpringbootApplication {

	@PostConstruct
	void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
	}

}
  
4. Create a domain models. 
    i. User model with attribute fields. Create a role for each user log in. 

      The User model contains the following fields -

      id: Primary Key
      username: A unique username
      email: A unique email
      password: A password which will be stored in encrypted format.
      roles: A set of roles. (Many-To-Many relationship with Role entity)


  ii. Role model contains id and name field. Name field will be enum with only two values Role_User and Role_Admin. 
      
      @Entity
      @Table(name = "roles")
      public class Role {
          @Id
          @GeneratedValue(strategy = GenerationType.IDENTITY)
          private Long id;

          @Enumerated(EnumType.STRING)
          @NaturalId
          @Column(length = 60)
          private RoleName name;
     }
     
  iii. RoleName enum class. 
  
       public enum  RoleName {
            ROLE_USER,
            ROLE_ADMIN
        }

5. Create a repository to acces User and Role data. 
    -> Repositories are used to persisting the domain models to the databases and retrieving them. 
    
    i. UserRepository: 
    
        @Repository
        public interface UserRepository extends JpaRepository<User, Long> {
            Optional<User> findByEmail(String email);

            Optional<User> findByUsernameOrEmail(String username, String email);

            List<User> findByIdIn(List<Long> userIds);

            Optional<User> findByUsername(String username);

            Boolean existsByUsername(String username);

            Boolean existsByEmail(String email);
    }

  ii. RoleRepository: 
  
      @Repository
      public interface RoleRepository extends JpaRepository<Role, Long> {
          Optional<Role> findByName(RoleName roleName);
      }

