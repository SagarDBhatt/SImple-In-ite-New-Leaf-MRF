package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="Machine_Hours_Fact")
public class MachineHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long machineHoursId;

    @Getter @Setter
    private Double daily_running_hours;

    @Getter @Setter
    private Double clock_hours;

    @Getter @Setter
    private Date date;

    @Getter @Setter
    private Date system_created_date;

    @Getter @Setter
    private String comments;
}
