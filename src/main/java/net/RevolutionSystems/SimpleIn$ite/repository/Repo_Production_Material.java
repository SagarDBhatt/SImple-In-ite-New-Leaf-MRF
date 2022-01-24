package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.Production_dim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface Repo_Production_Material extends JpaRepository<Production_dim,Long> {

    public static final String sql_dash_production_daily = "  SELECT *\n" +
            "FROM [CURRENT_MONTH_PRODUCTION]  \n" +
            "ORDER BY DATE ";

    public static final String sql_dash_production_quarterly = "SELECT Prod_Month_Name, Total_Weight FROM [QUARTER_MONTH_PRODUCTION]\n" +
            "ORDER BY Prod_Month";

    public static final String sp_residue_rate = "EXEC SP_Residue_Rate";

    public static final String sp_production_machineHour = "EXEC SP_PROD_PER_MACHINEHOUR";

    public static final String view_recycle_reject = "SELECT TOP (1000) [MONTH_NAME]\n" +
            "      ,[MONTH_INDEX]\n" +
            "      ,[YEAR]\n" +
            "      ,[INBOUND]\n" +
            "      ,[TRASHOUT]\n" +
            "      ,[RECYCLE]\n" +
            "      ,[REJECT PERCENTAGE]\n" +
            "  FROM [V_RECYCLE_REJECT_PERCENTAGE]\n" +
            "  ORDER BY MONTH_INDEX ";


    @Query(value = "Select Material_ID from Material_Dim where Material_Type = ?1")
    Long getMaterialID(String materialType);

    @Modifying
    @Transactional
    @Query(value = "insert into production_dim (material_dim_material_id, date, total_weight_tons, \n" +
            "\ttotal_weight_lb, system_created_date)\n" +
            "\tvalues (?1, ?2,?4,?3,?2)", nativeQuery = true)
    void saveObject(long Id, Date date, double weightLb, double weihgtTons);

    /**
     * Created a VIEW to run the query and fetch the result in a SQL Table format. Fetch the SQL table to get the required data from backend database.
     * @return
     */
    @Modifying
    @Transactional
    @Query(value = sql_dash_production_daily, nativeQuery = true)
    List<Map<String,Object>> grp_Production();

    @Modifying
    @Transactional
    @Query(value = sql_dash_production_quarterly, nativeQuery = true)
    List<Map<String,Object>> graph_quarterly_production();

    /**
     * Calling Stored Procedure to run the calculations and fetch Residue Rate for last 30 days.
     * @return
     */
    @Modifying
    @Transactional
    @Query(value = sp_residue_rate, nativeQuery = true)
    List<Map<String,Object>> get_store_proc_residue_rate();

    /**
     * Calling Stored Procedure to run the calculations and fetch Production per machineHour for last 30 days and year-to-date value,
     * @return
     */
    @Modifying
    @Transactional
    @Query(value = sp_production_machineHour, nativeQuery = true)
    List<Map<String,Object>> get_store_proc_prod_per_machinehour();

    /**
     * SQL View (table) to fetch the monthly recycled, rejects, rejects percentage data.
     * @return
     */
    @Modifying
    @Transactional
    @Query(value = view_recycle_reject, nativeQuery = true)
    List<Map<String,Object>> get_monthly_recycle_reject();
}
