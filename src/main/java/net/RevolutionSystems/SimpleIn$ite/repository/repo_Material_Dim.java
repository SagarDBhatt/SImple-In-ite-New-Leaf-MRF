package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.Material_Dim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

public interface repo_Material_Dim extends JpaRepository<Material_Dim,Long> {

    public final String qry_inventory_count = "  SELECT *\n" +
            "  FROM INVENTORY_COUNT_V";

    @Query(value = "Select Inventory_Count\n" +
            "from Material_Dim\n" +
            "where Material_ID = ?1")
    Long getCurrentInventoryCount(Long materialId);

    @Modifying
    @Transactional
    @Query(value = "Update Material_Dim\n" +
            "set Inventory_Count = ?1\n" +
            "where Material_ID=?2")
    void addInventoryCountFromProduction(Long newInventoryCount,Long materialId);

    @Modifying
    @Transactional
    @Query(value = qry_inventory_count, nativeQuery = true)
    List<Map<String,Object>> inventory_cnt();

}
