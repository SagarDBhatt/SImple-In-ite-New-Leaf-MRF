package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Production_dim")
public class Production_dim {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Baled_Material_ID;

    @Getter @Setter
    //@Column(name = "Total_Weight_Lb")
    private double Total_Weight_Lb;

    @Getter @Setter
    private double Total_Weight_Tons;

    @Getter @Setter
    private Date date;

    @Getter @Setter
    private Date System_Created_Date;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Material_Dim material_dim;

    public Production_dim(double total_Weight_Lb, double total_Weight_Tons, Date date, Date system_Created_Date, Material_Dim material_dim) {
        Total_Weight_Lb = total_Weight_Lb;
        Total_Weight_Tons = total_Weight_Tons;
        this.date = date;
        System_Created_Date = system_Created_Date;
        this.material_dim = material_dim;
    }
}
