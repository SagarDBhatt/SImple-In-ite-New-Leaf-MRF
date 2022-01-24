package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "employee_timesheet_fact")
public class Employee_Timesheet_Fact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Timesheet_ID;

    @Getter @Setter
    private Double Daily_Hours_Worked;

    @Getter @Setter
    private Double Break_Hours;

    @Getter @Setter
    private Date date;

    @Getter @Setter
    private Date System_Created_Date;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Employee_dim employee_dim;
}
