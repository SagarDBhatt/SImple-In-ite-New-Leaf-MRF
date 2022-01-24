package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.supplier_dim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface Repo_Supplier extends JpaRepository<supplier_dim,Long> {
    
    public static final String sql_dash_daily_inbound = "SELECT [Date]\n" +
            "  ,[Total_Weight]\n" +
            "  FROM [CURRENT_MONTH_INBOUND]\n" +
            "  order by [Date]";

    @Query( " select supplier_id from supplier_dim where supplier_Name = ?1 ")
    Long getSupplierID(String supplierName);


    @Modifying
    @Transactional
    @Query(value = "  Insert into incoming_single_stream_fact ([single_stream_incoming_date]\n" +
            "      ,[single_stream_incoming_weight_ticket_number]\n" +
            "      ,[system_updated_date]\n" +
            "      ,[total_weight_lb]\n" +
            "      ,[total_weight_tons]\n" +
            "      ,[supplier_dim_supplier_id] \n" +
            "      ,[single_stream_incoming_material_type]) \n"+
            "\t  values (?1,?2,?3,?4,?5,?6,?7)", nativeQuery = true)
    void saveSingleStreamMaterial(Date date, Set<Long> WeightTicket, java.util.Date systemDate,
                                  Double incomingSSWeightLB, Double incomingSSWeightTons, Long supplier_ID, String materialType);

    @Modifying
    @Transactional
    @Query(value = sql_dash_daily_inbound, nativeQuery = true)
    List<Map<String,Object>>
    graph_daily_inbound();
}
