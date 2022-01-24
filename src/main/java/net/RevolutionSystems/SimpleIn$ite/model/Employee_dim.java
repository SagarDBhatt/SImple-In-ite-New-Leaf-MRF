package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data   // Data is attribute of Lombok class which includes @Getters @Setters annotation for getter & setters method.
@Entity
@Table(name = "employee_dim")
public class Employee_dim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employee_id;

    @Getter @Setter @NotBlank
    private String employee_Name;

    @Getter @Setter @Email @NotBlank
    private String employee_Email;

    @Getter @Setter @NotBlank
    private Long employee_Number;

    @OneToMany
    private Set<Employee_Timesheet_Fact> employee_timesheet_facts;

}
