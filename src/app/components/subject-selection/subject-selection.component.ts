import { Component, OnInit } from '@angular/core';
import { EnrollmentService, Subject } from '../../services/enrollment.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject-selection',
  templateUrl: './subject-selection.component.html',
  styleUrls: ['./subject-selection.component.css']
})
export class SubjectSelectionComponent implements OnInit {
  subjects: Subject[] = [];
  selectedSubjects: number[] = [];
  errorMessage: string | null = null;
  studentId: number | null = null;
  programId: number | null = null;

  constructor(
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentId = this.authService.getStudentId();
    this.programId = this.authService.getProgramId();

    if (this.programId) {
      this.loadSubjects();
    } else {
      this.errorMessage = 'No se pudo obtener el programa del estudiante. Por favor, inicia sesión de nuevo.';
    }
  }

  loadSubjects(): void {
    if (!this.programId) {
      this.errorMessage = 'No se pudo cargar las materias porque no hay un programa asociado.';
      return;
    }

    this.enrollmentService.getSubjectsByProgram(this.programId).subscribe(
      (data) => {
        this.subjects = data.map(subject => ({ ...subject, isDisabled: false }));
        this.errorMessage = null;
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error al cargar las materias. Por favor, intenta de nuevo.';
      }
    );
  }

  toggleSubjectSelection(subject: Subject): void {
    const index = this.selectedSubjects.indexOf(subject.id);

    if (index !== -1) {
      this.selectedSubjects.splice(index, 1);
      this.errorMessage = null;
    } else if (this.selectedSubjects.length < 3 && !this.hasSameTeacher(subject)) {
      this.selectedSubjects.push(subject.id);
      this.errorMessage = null;
    } else if (this.selectedSubjects.length >= 3) {
      this.errorMessage = 'Solo puedes seleccionar hasta 3 materias.';
      return;
    } else {
      this.errorMessage = 'No puedes seleccionar materias impartidas por el mismo profesor.';
      return;
    }

    this.updateSubjectState();
  }

  hasSameTeacher(subject: Subject): boolean {
    return this.selectedSubjects.some((selectedId) => {
      const selectedSubject = this.subjects.find((s) => s.id === selectedId);
      return selectedSubject && selectedSubject.teacherName === subject.teacherName;
    });
  }

  updateSubjectState(): void {
    this.subjects.forEach((subject) => {
      const isAlreadySelected = this.selectedSubjects.includes(subject.id);
      const hasSelectedTeacher = this.hasSameTeacher(subject);
      subject.isDisabled = this.selectedSubjects.length >= 3 && !isAlreadySelected || hasSelectedTeacher;
    });
  }

  clearSelection(): void {
    this.selectedSubjects = [];
    this.errorMessage = null;
    this.subjects.forEach(subject => subject.isDisabled = false);
  }

  enrollSubjects(): void {
    if (this.selectedSubjects.length !== 3) {
      this.errorMessage = 'Debes seleccionar exactamente 3 materias.';
      return;
    }

    if (this.studentId) {
      this.enrollmentService.enrollSubjects(this.studentId, this.selectedSubjects).subscribe(
        () => {
          this.errorMessage = null;
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          console.error(error);
          this.errorMessage = 'Error al inscribir las materias. Por favor, intenta de nuevo.';
        }
      );
    } else {
      this.errorMessage = 'No se pudo obtener el ID del estudiante. Por favor, inicia sesión de nuevo.';
    }
  }
}
