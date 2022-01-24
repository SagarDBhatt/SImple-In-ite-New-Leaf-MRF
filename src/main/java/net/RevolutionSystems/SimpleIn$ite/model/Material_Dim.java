package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.sql.Date;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Material_Dim")
public class Material_Dim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Material_ID;

    @Getter @Setter
    private String Material_Type;

    @Getter @Setter
    private String Material_Type_Description;

    @Getter @Setter
    private Date Material_System_Updated_Date;

    @Getter @Setter
    private Long Inventory_Count;

    @Getter @Setter
    private Long target_inventory_truckload;

    @OneToMany
    private Set<Production_dim> production_dims;

    @OneToMany
    private Set<SoldMaterial_fact> soldMaterial_facts;
}
