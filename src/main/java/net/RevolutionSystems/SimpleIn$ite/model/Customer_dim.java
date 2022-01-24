package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Customer_dim")
public class Customer_dim {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long customer_id;

    @Getter
    @Setter
    private String customer_Name;

    @Getter @Setter
    private String contact_Person_Name;

    @Getter @Setter
    private String phone_Number;

    @Getter @Setter
    private String email_Address;

    @Getter @Setter
    private Date system_Update_Date;

    @OneToMany
    private Set<SoldMaterial_fact> soldMaterial_facts;
}
