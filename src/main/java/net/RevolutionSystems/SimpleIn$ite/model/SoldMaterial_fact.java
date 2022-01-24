package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "soldmaterial_fact")
public class SoldMaterial_fact {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Sold_Material_Id;

    @Getter @Setter
    private long Sold_Weight_Ticket_Number;

    @Getter @Setter
    private long Sold_BOL_Number;

    @Getter @Setter
    private double Sold_Weight_LB;

    @Getter @Setter
    private double Sold_Weight_Tons;

    @Getter @Setter
    private int Number_Of_Sold_Bales;

    @Getter @Setter
    private Date Sold_Material_Date;

    @Getter @Setter
    private Date System_Created_Date;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Material_Dim material_dim;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Customer_dim customer_dim;
}
