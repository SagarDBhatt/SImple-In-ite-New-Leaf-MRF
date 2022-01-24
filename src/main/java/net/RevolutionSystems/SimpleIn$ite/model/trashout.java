package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="trashout_Fact")
public class trashout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Trashout_Id;

    @Getter @Setter
    private Long Trashout_Weight_Ticket_Number;

    @Getter @Setter
    private Date Trashout_Date;

    @Getter @Setter
    private double Trashout_Weight_LB;

    @Getter @Setter
    private double Trashout_Weight_Tons;

    @Getter @Setter
    private Date System_updated_Date;

//    @ManyToOne(cascade = CascadeType.PERSIST)
//    private supplier_dim supplier_dim;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Landfill_Owner landfill_owner;
}
