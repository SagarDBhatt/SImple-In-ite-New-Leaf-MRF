package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.Employee_dim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Date;

public interface Repo_Employee_dim extends JpaRepository<Employee_dim,Long> {


    @Query(value = "select employee_id from employee_dim where employee_name=?1", nativeQuery = true)
    Long getEmployeeId(String employeeName);

    @Modifying
    @Transactional
    @Query(value = "insert into employee_timesheet_fact(date,daily_hours_worked,break_hours,\n" +
           "  system_created_date,employee_dim_employee_id)\n" +
           "  values(?1,?2,?3,?4,?5)", nativeQuery = true)
   void saveEmployeeTimesheet(Date date,Double daily_hours_worked, Double break_hours, Date system_created_date,
                              Long employee_dim_employee_id);

}
