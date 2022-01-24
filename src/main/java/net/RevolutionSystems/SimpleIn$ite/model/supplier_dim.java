package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Supplier_Dim")
public class supplier_dim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplier_id;

    @Getter @Setter
    private String supplier_Name;

    @Getter @Setter
    private String contact_Name;

    @Getter @Setter
    private String phone_Number;

    @Getter @Setter
    private String email_Address;

    @Getter @Setter
    private Date system_Update_Date;

    @OneToMany
    private Set<Incoming_SingleStream> incoming_singleStreams;

//    @OneToMany
//    private Set<trashout> trashouts;
}
