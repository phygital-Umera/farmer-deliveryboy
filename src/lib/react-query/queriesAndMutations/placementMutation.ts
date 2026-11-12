import { 
  addPlacement, 
  deletePlacement, 
  getPlacementById, 
  getPlacements, 
  updatePlacement, 
  assignStudentsToPlacement,
 getAssignedStudents,
} from "@/lib/api/admin/placementapi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddPlacement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, role }: { payload: any; role?: string }) => addPlacement(payload, role),
    onSuccess: () => {
      toast.success('Placement added successfully');
      queryClient.invalidateQueries({queryKey: ['placements']});
    },
    onError: () => {
      toast.error('Failed to save placement');
    },
  });
};

export const useGetPlacement = (role?: string) => {
  return useQuery({
    queryKey: ['placements', role],
    queryFn: () => getPlacements(role),
    enabled: Boolean(role),
  });
}

export const useUpdatePlacement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, payload, role}: {id: string; payload: any; role?: string}) => updatePlacement(id, payload, role),
    onSuccess: () => {
      toast.success('Placement updated successfully');
      queryClient.invalidateQueries({queryKey: ['placements']});
      queryClient.invalidateQueries({queryKey: ['placement']});
    },
    onError: () => {
      toast.error('Failed to update placement');
    },
  });
};

export const useDeletePlacement = (role?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePlacement(id, role),
    onSuccess: () => {
      toast.success('Placement deleted successfully');
      queryClient.invalidateQueries({queryKey: ['placements']});
    },
    onError: () => {
      toast.error('Failed to delete placement');
    },
  });
};

export const useGetPlacementById = (id: string, role?: string) => {
  return useQuery({
    queryKey: ['placement', id, role],
    queryFn: () => getPlacementById(id, role),
    enabled: Boolean(id) && Boolean(role),
  });
}


// ============================================
// ASSIGN STUDENTS TO PLACEMENT
// ============================================
export const useAssignStudentsToPlacement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ placementId, interviewDetails, role }: { 
      placementId: string; 
      interviewDetails?: {
        student: { studentId: string }[]; 
        interviewMode?: string;
        interviewDate?: string;   // ISO string with time merged in
        interviewLocation?: string;
      };
      role?: string;
    }) => assignStudentsToPlacement(placementId, interviewDetails, role),
    onSuccess: () => {
      toast.success('Students assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['placements'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-students'] });
    },
    onError: (error: any) => {
      console.error('Assignment error:', error);
      toast.error("Student already assigned");
    },
  });
};

// ============================================
// GET ASSIGNED STUDENTS
// ============================================
export const useGetAssignedStudents = (
  placementId: string,
  role?: string,
) => {
  return useQuery({
    queryKey: [
      'assigned-students',
      placementId,
      role,
    ],

    queryFn: () =>
      getAssignedStudents(
        placementId,
        role,
      ),

    // Do not call the API until a placement is selected
    enabled: Boolean(
      placementId,
    ),
  });
};



// // ============================================
// // GET ASSIGNED STUDENTS
// // ============================================
// export const useGetAssignedStudents = (placementId: string, role?: string) => {
//   return useQuery({
//     queryKey: ['placement', 'students', placementId],
//     queryFn: () => getAssignedStudents(placementId, role),
//     enabled: Boolean(placementId),
//   });
// };
// import { addPlacement, deletePlacement, getPlacementById, getPlacements, updatePlacement } from "@/lib/api/admin/placementapi";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// export const useAddPlacement = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ payload, role }: { payload: any; role?: string }) => addPlacement(payload, role),
//     onSuccess: () => {
//       toast.success('Placement added successfully');
//       queryClient.invalidateQueries({queryKey: ['placements']});
//     },
//     onError: () => {
//       toast.error('Failed to save placement');
//     },
//   });
// };
// // export const useGetPlacement = () => {
// //     console.log("useAddBatch called");
// //   const queryClient = useQueryClient();
// //   return useMutation({
// //     mutationFn: getPlacements,
// //     onSuccess: () => {
// //       toast.success('Batch added successfully');
// //       queryClient.invalidateQueries({queryKey: ['batches']});
// //     },
    
// //     onError: () => {
// //       toast.error('Failed To Save batch');
// //     },
// //   });
// // }

// export const useGetPlacement = (role?: string) => {
//   return useQuery({
//     queryKey: ['placements', role],
//     queryFn: () => getPlacements(role),
//     enabled: Boolean(role),
//   });
// }

// export const useUpdatePlacement = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({id, payload, role}: {id: string; payload: any; role?: string}) => updatePlacement(id, payload, role),
//     onSuccess: () => {
//       toast.success('Placement updated successfully');
//       queryClient.invalidateQueries({queryKey: ['placements']});
//       queryClient.invalidateQueries({queryKey: ['placement']});
//     },
//     onError: () => {
//       toast.error('Failed to update placement');
//     },
//   });
// };

// export const useDeletePlacement = (role?: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => deletePlacement(id, role),
//     onSuccess: () => {
//       toast.success('Placement deleted successfully');
//       queryClient.invalidateQueries({queryKey: ['placements']});
//     },
//     onError: () => {
//       toast.error('Failed to delete placement');
//     },
//   });
// };

// export const useGetPlacementById = (id: string, role?: string) => {
//   return useQuery({
//     queryKey: ['placement', id, role],
//     queryFn: () => getPlacementById(id, role),
//     enabled: Boolean(id) && Boolean(role),
//   });
// }