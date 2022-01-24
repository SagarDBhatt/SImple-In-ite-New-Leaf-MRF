package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.MachineHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface Repo_Machine_Hours extends JpaRepository<MachineHours, Long> {

    public final static String qry_machine_hours_system_efficiency = "SELECT [DATE]\n" +
            "      ,[MACHINE HOURS]\n" +
            "      ,[SYSTEM EFFICIENCY]\n" +
            "  FROM [MACHINE_HOURS_SYSTEM_EFFICIENCY]\n" +
            "  ORDER BY DATE";

    @Query(value = "select Top 1 clock_hours\n" +
            "    from machine_hours_fact\n" +
            "    order by machine_hours_id DESC", nativeQuery = true)
    Double getLastClockHours();

    @Modifying
    @Transactional
    @Query(value = "Insert into machine_hours_fact(clock_hours,comments,daily_running_hours,date,system_created_date)\n" +
            "values(?1,?2,?3,?4,?5)", nativeQuery = true)
    void saveObject(Double clockHours,String comments, Double machineRunHours, Date date, Date systemCreatedDate);

    /**
     * Query to fetch the daily machine running hours for the last 30 days.
     * @return
     */
    @Modifying
    @Transactional
    @Query(value = qry_machine_hours_system_efficiency, nativeQuery = true)
    List<Map<String,Object>> get_daily_machine_hours();

}
