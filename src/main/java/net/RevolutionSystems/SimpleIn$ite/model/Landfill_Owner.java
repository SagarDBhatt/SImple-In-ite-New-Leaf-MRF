package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Landfill_owner_dim")
public class Landfill_Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Landfill_owner_id;

    @Getter @Setter
    private String Landfill_owner_name;

    @OneToMany
    private Set<trashout> trashoutSet;
}
