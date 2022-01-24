package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.Incoming_SingleStream;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface repo_incoming_singleStream extends JpaRepository<Incoming_SingleStream, Long> {


    public static final String qry_update_inbound= "  UPDATE incoming_single_stream_fact\n" +
            "  SET single_stream_incoming_date = ?1 " +
            "   ,total_weight_lb= ?2  " +
            "   ,single_stream_incoming_material_type= ?3\n" +
            "   ,system_updated_date=?4 " +
            "   ,total_weight_tons=?5 " +
            "   ,supplier_dim_supplier_id=?6 \n" +
            "   WHERE single_stream_incoming_weight_ticket_number = ?7";


    @Query("  SELECT SingleStream_Incoming_Weight_Ticket_Number\n" +
            "  FROM Incoming_SingleStream\n" +
            "  WHERE SingleStream_Incoming_Weight_Ticket_Number = ?1 ")
    Long findBySingleStream_Incoming_Weight_Ticket_Number(Long wtticket);


    @Modifying
    @Transactional
    @Query(value =  "UPDATE incoming_single_stream_fact " +
                    "SET single_stream_incoming_date = ?1 " +
                    "    ,total_weight_lb= ?2 " +
                    "    ,single_stream_incoming_material_type= ?3 " +
                    "    ,system_updated_date=?4 " +
                    "    ,total_weight_tons=?5 " +
                    "    ,supplier_dim_supplier_id=?6 " +
                    "    WHERE single_stream_incoming_weight_ticket_number = ?7", nativeQuery = true)
    void update_inbound(Date incomingDate,
                        Double inboundWeight_Lb,
                        String inbound_material_type,
                        Date systemDate,
                        Double inbound_weight_tons,
                        Long supplier_id,
                        Long inbound_weightTicket);



}
