package net.RevolutionSystems.SimpleIn$ite.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="Incoming_Single_Stream_Fact")
public class Incoming_SingleStream {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Incoming_SingleStream_ID;

    @Getter @Setter
    private Long SingleStream_Incoming_Weight_Ticket_Number;

    @Getter @Setter
    private String SingleStream_Incoming_MaterialType;

    @Getter @Setter
    private Date SingleStream_Incoming_Date;

    @Getter @Setter
    private double Total_Weight_LB;

    @Getter @Setter
    private double Total_Weight_Tons;

    @Getter @Setter
    private Date System_updated_Date;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private supplier_dim supplier_dim;
}
