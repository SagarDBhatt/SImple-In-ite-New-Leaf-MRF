package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.Customer_dim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface Repo_Customers extends JpaRepository<Customer_dim,Long> {

    @Query(value = "select customer_id from Customer_dim where customer_Name = ?1 ")
    Long getCustomerID(String customerName);
}
