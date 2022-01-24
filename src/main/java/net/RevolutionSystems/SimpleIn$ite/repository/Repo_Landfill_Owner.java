package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.Landfill_Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface Repo_Landfill_Owner extends JpaRepository<Landfill_Owner,Long> {

    @Query("Select Landfill_owner_id from Landfill_Owner where Landfill_owner_name = ?1")
    Long getLandfillOwnerId(String Landfill_Owner_Name);

}
