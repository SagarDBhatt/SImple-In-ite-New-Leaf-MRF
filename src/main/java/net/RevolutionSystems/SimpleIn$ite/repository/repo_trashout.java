package net.RevolutionSystems.SimpleIn$ite.repository;

import net.RevolutionSystems.SimpleIn$ite.model.trashout;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

public interface repo_trashout extends JpaRepository<trashout,Long> {

//    String qry_overwrite_trashout = "  UPDATE [trashout_fact]\n" +
//            "  SET [trashout_weight_lb] = 7421,\n" +
//            "  [trashout_weight_tons] = 3.72,\n" +
//            "  [trashout_weight_ticket_number] = 106108,\n" +
//            "  [landfill_owner_landfill_owner_id] = 1,\n" +
//            "  [system_updated_date] = '2021-03-23',\n" +
//            "  [trashout_date] = '2021-03-23'\n" +
//            "  WHERE [trashout_weight_ticket_number] = 106108";

    @Modifying
    @Transactional
    @Query(value = "  Insert into trashout_fact(system_updated_date,trashout_date,trashout_weight_lb,trashout_weight_tons,trashout_weight_ticket_number,\n" +
            "  landfill_owner_landfill_owner_id)\n" +
            "  values (?1,?2,?3,?4,?5,?6) ", nativeQuery = true)
    void saveTrashout(java.util.Date systemDate, java.util.Date trashDate,Double TrashoutWeightLb,Double TrashoutWeightTons,
                      Long TrashoutWeightTicket, Long Landfill_Owner_Id);

    @Modifying
    @Transactional
    @Query(value = "  UPDATE [trashout_fact]\n" +
            "  SET [trashout_weight_lb] = ?3,\n" +
            "  [trashout_weight_tons] = ?4,\n" +
            "  [trashout_weight_ticket_number] = ?5,\n" +
            "  [landfill_owner_landfill_owner_id] = ?6,\n" +
            "  [system_updated_date] =?1,\n" +
            "  [trashout_date] = ?2\n" +
            "  WHERE [trashout_weight_ticket_number] = ?5", nativeQuery = true)
    void overwrite_trash(java.util.Date systemDate,
                         java.util.Date trashDate,
                         Double TrashoutWeightLb,
                         Double TrashoutWeightTons,
                         Long TrashoutWeightTicket,
                         Long Landfill_Owner_Id);

}
