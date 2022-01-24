package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.SoldMaterial_fact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

public interface Repo_SoldMaterial extends JpaRepository<SoldMaterial_fact,Long> {

    public final static String qry_sold_weight = "SELECT [Sold_Weight_Tons]\n" +
            "      ,[Material_Type]\n" +
            "  FROM [V_SOLD_INVENTORY]";

    /**
     * Query to save the Transaction of Sold material.
     * @param soldBales
     * @param SoldWeightInLbs
     * @param SoldWeightInTons
     * @param systemDate
     * @param BOLNumber
     * @param soldDate
     * @param soldWeightTicketNumber
     * @param customerID
     * @param materialId
     */
    @Modifying
    @Transactional
    @Query(value = "Insert into soldmaterial_fact (number_of_sold_bales,sold_weight_lb,sold_weight_tons,system_created_date,sold_bol_number,\n" +
            "sold_material_date,sold_weight_ticket_number,customer_dim_customer_id,material_dim_material_id)\n" +
            "values(?1,?2,?3,?4,?5,?6,?7,?8,?9)", nativeQuery = true)
    void saveSoldMaterial(Long soldBales,Double SoldWeightInLbs,Double SoldWeightInTons,
                          java.util.Date systemDate,String BOLNumber,java.util.Date soldDate,Long soldWeightTicketNumber,
                          Long customerID,Long materialId);

    /**
     * Query to fetch the customer Id to populate in a drop down list.
     * @param customerName
     * @return
     */
    @Query(value = "select customer_id from Customer_dim where customer_Name = ?1 ")
    Long getCustomerID(String customerName);

    @Modifying
    @Transactional
    @Query(value = qry_sold_weight, nativeQuery = true)
    List<Map<String,Object>> get_sold_weight();
}


